 class Animation {
	constructor(){
		this.AnimJson = {};		
		this.FramesLimit = 0;	
		this.CurrentFrame = 0;
		this.FrameRate = 100;
		this.Oscillate = true;
		this.OldTime = 0;
		this.FrameInc = 1;
	}

	OnAnimate(){
		if (this.OldTime + this.FrameRate > Date.now()) {
			return;
		}
	
		this.OldTime = Date.now();
	
		this.CurrentFrame += this.FrameInc;
	
		if (this.Oscillate) {
			if (this.FrameInc > 0) {
				if (this.CurrentFrame >= this.FramesLimit) {
					this.FrameInc = -this.FrameInc;
				}
			}
			else {
				if (this.CurrentFrame <= 0) {
					this.FrameInc = -this.FrameInc;
				}
			}
		}
		else {
			if (this.CurrentFrame >=  this.FramesLimit) {
				this.CurrentFrame  = 0;
			}
		}
	}

	render(state) {
		
	}
}

module.exports = Animation;