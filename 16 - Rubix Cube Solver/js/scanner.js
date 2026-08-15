 






 






function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h;
    const s = max === 0 ? 0 : (d / max) * 100;
    const v = max * 100;

    if (d === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
        h = ((b - r) / d + 2) / 6;
    } else {
        h = ((r - g) / d + 4) / 6;
    }

    return { h: h * 360, s, v };
}

 

















function classifyColor(h, s, v) {
     
    if (s < 20 && v > 65) {
        return 'U';
    }

     
    if (h >= 35 && h <= 65 && s > 30 && v > 50) {
        return 'D';
    }

     
    if ((h <= 10 || h >= 340) && s > 40 && v > 30) {
        return 'R';
    }

     
    if (h > 10 && h < 35 && s > 40 && v > 40) {
        return 'L';
    }

     
    if (h >= 80 && h <= 165 && s > 25 && v > 20) {
        return 'F';
    }

     
    if (h >= 180 && h <= 260 && s > 25 && v > 20) {
        return 'B';
    }

     
    const hueTargets = [
        { face: 'R', hue: 0 },
        { face: 'L', hue: 22 },
        { face: 'D', hue: 50 },
        { face: 'F', hue: 120 },
        { face: 'B', hue: 220 },
    ];

    let bestFace = 'U';
    let bestDist = Infinity;

    for (const { face, hue } of hueTargets) {
         
        let dist = Math.abs(h - hue);
        if (dist > 180) dist = 360 - dist;

        if (dist < bestDist) {
            bestDist = dist;
            bestFace = face;
        }
    }

    return bestFace;
}

 











export class CubeScanner {
    constructor() {
         
        this.stream = null;
         
        this.isMirrored = true;
         
        this.isActive = false;
    }

     




    async startCamera(videoElement) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user',
                },
            });

            videoElement.srcObject = stream;

            await new Promise((resolve) => {
                videoElement.addEventListener('loadedmetadata', resolve, { once: true });
            });

            this.stream = stream;
            this.isActive = true;
            return true;
        } catch (err) {
            console.error('CubeScanner: Failed to start camera —', err);
            this.isActive = false;
            return false;
        }
    }

     


    stopCamera() {
        if (this.stream) {
            for (const track of this.stream.getTracks()) {
                track.stop();
            }
            this.stream = null;
        }
        this.isActive = false;
    }

     













    detectColors(videoElement, canvasElement) {
        const ctx = canvasElement.getContext('2d');
        const width = canvasElement.width;
        const height = canvasElement.height;

         
        ctx.drawImage(videoElement, 0, 0, width, height);

         
        const padX = width * 0.1;
        const padY = height * 0.1;
        const gridW = width - 2 * padX;
        const gridH = height - 2 * padY;
        const cellW = gridW / 3;
        const cellH = gridH / 3;

         
        const colors = [];

         
        const sampleSize = 20;
        const halfSample = sampleSize / 2;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                 
                const rawCol = this.isMirrored ? 2 - col : col;

                const centerX = padX + rawCol * cellW + cellW / 2;
                const centerY = padY + row * cellH + cellH / 2;

                 
                const sx = Math.max(0, Math.round(centerX - halfSample));
                const sy = Math.max(0, Math.round(centerY - halfSample));
                const sw = Math.min(sampleSize, width - sx);
                const sh = Math.min(sampleSize, height - sy);

                const imageData = ctx.getImageData(sx, sy, sw, sh);
                const pixels = imageData.data;
                const pixelCount = sw * sh;

                let totalR = 0;
                let totalG = 0;
                let totalB = 0;

                for (let p = 0; p < pixelCount; p++) {
                    totalR += pixels[p * 4];
                    totalG += pixels[p * 4 + 1];
                    totalB += pixels[p * 4 + 2];
                }

                const avgR = totalR / pixelCount;
                const avgG = totalG / pixelCount;
                const avgB = totalB / pixelCount;

                const hsv = rgbToHsv(avgR, avgG, avgB);
                colors.push(classifyColor(hsv.h, hsv.s, hsv.v));
            }
        }

        return colors;
    }

     







    drawOverlay(ctx, width, height, detectedColors) {
        ctx.clearRect(0, 0, width, height);

         
        const padX = width * 0.1;
        const padY = height * 0.1;
        const gridW = width - 2 * padX;
        const gridH = height - 2 * padY;
        const cellW = gridW / 3;
        const cellH = gridH / 3;

         
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

         
        ctx.strokeRect(padX, padY, gridW, gridH);

         
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(padX + i * cellW, padY);
            ctx.lineTo(padX + i * cellW, padY + gridH);
            ctx.stroke();
        }

         
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(padX, padY + i * cellH);
            ctx.lineTo(padX + gridW, padY + i * cellH);
            ctx.stroke();
        }

         
         
        const colorMap = {
            U: '#FFFFFF',
            R: '#FF3B30',
            F: '#34C759',
            D: '#FFD60A',
            L: '#FF9500',
            B: '#007AFF',
        };

        const indicatorW = cellW * 0.4;
        const indicatorH = cellH * 0.4;
        const cornerRadius = 4;

        for (let i = 0; i < 9 && i < detectedColors.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const color = detectedColors[i];

            if (!color || !(color in colorMap)) continue;

            const cx = padX + col * cellW + cellW / 2;
            const cy = padY + row * cellH + cellH / 2;
            const rx = cx - indicatorW / 2;
            const ry = cy - indicatorH / 2;

             
            ctx.fillStyle = colorMap[color];
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.roundRect(rx, ry, indicatorW, indicatorH, cornerRadius);
            ctx.fill();

             
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.globalAlpha = 1.0;
        }
    }
}
