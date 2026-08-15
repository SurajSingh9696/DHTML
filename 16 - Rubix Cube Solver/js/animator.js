 






import { Cube3D } from './cube3d.js';

 












export class SolutionAnimator {
     


    constructor(cube3d) {
         
        this.cube3d = cube3d;

         



        this.moves = [];

         



        this.initialState = '';

         





        this._currentIndex = -1;

         
        this._isPlaying = false;

         




        this._speed = 1.0;

         




        this._updateCallback = null;

         
        this._cancelPlay = false;
    }

     
     
     

     
    get currentIndex() {
        return this._currentIndex;
    }

     
    get totalMoves() {
        return this.moves.length;
    }

     
    get isPlaying() {
        return this._isPlaying;
    }

     
     
     

     





    setMoves(moves, initialState) {
        this.pause();
        this.moves = moves;
        this.initialState = initialState;
        this._currentIndex = -1;
        this.cube3d.setState(initialState);
        this._notify();
    }

     




    onUpdate(callback) {
        this._updateCallback = callback;
    }

     





    setSpeed(multiplier) {
        this._speed = Math.max(0.25, Math.min(3, multiplier));
    }

     
     
     

     





    async next() {
        if (this._currentIndex >= this.moves.length - 1) return;
        this._currentIndex++;
        const move = this.moves[this._currentIndex];
        const duration = 400 / this._speed;
        await this.cube3d.animateMove(move, duration);
        this._notify();
    }

     





    async prev() {
        if (this._currentIndex < 0) return;
        const move = this.moves[this._currentIndex];
        const inverseMove = this._invertMove(move);
        this._currentIndex--;
        const duration = 400 / this._speed;
        await this.cube3d.animateMove(inverseMove, duration);
        this._notify();
    }

     




    async goToStart() {
        this.pause();
        this._currentIndex = -1;
        this.cube3d.setState(this.initialState);
        this._notify();
    }

     





    async goToEnd() {
        this.pause();
         
        this.cube3d.setState(this.initialState);
        for (let i = 0; i < this.moves.length; i++) {
            await this.cube3d.animateMove(this.moves[i], 50);
        }
        this._currentIndex = this.moves.length - 1;
        this._notify();
    }

     
     
     

     





    async play() {
        if (this._isPlaying) return;
        this._isPlaying = true;
        this._cancelPlay = false;
        this._notify();

        while (this._currentIndex < this.moves.length - 1 && !this._cancelPlay) {
            await this.next();
             
            if (!this._cancelPlay) {
                await new Promise(r => setTimeout(r, 100 / this._speed));
            }
        }

        this._isPlaying = false;
        this._cancelPlay = false;
        this._notify();
    }

     


    pause() {
        this._cancelPlay = true;
        this._isPlaying = false;
        this._notify();
    }

     
     
     

     



    _notify() {
        if (this._updateCallback) {
            const move = this._currentIndex >= 0 && this._currentIndex < this.moves.length
                ? this.moves[this._currentIndex]
                : null;
            this._updateCallback(this._currentIndex, this.moves.length, move, this._isPlaying);
        }
    }

     










    _invertMove(move) {
        if (move.endsWith('2')) return move;
        if (move.endsWith("'")) return move[0];
        return move + "'";
    }
}
