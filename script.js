const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');

canvas.width=innerWidth-30;
canvas.height=innerHeight-30;
const gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
gradient.addColorStop(0,'white');

gradient.addColorStop(0.5,'red');
gradient.addColorStop(1,'blue');
ctx.fillStyle=gradient;
ctx.strokeStyle='white';


class Ball{
constructor(effect){
     this.effect=effect;
     
 this.radius=Math.floor(Math.random()*25+5);
     this.x=Math.floor(Math.random()*(this.effect.width-2*this.radius+1)+this.radius);
     this.y=Math.floor(Math.random()*(this.effect.height-2*this.radius+1)+this.radius);
    this.vx=Math.random()*4-2;
    this.vy=Math.random()*4-2;
    this.gravity=0.5;
}

draw(context){
 
 
 context.beginPath();
context.arc(this.x,this.y,this.radius,0,2*Math.PI);
context.fill();
context.stroke();
}

update(){
    if(this.effect.mouse.pressed){
        // this.x=this.effect.mouse.x;
        // this.y=this.effect.mouse.y;
        const dx=this.x-this.effect.mouse.x;
        const dy=this.y-this.effect.mouse.y;
        const distance=Math.hypot(dx,dy);
        if(distance<this.effect.mouse.radius){
            const angle=Math.atan2(dy,dx);
            this.x+=Math.cos(angle);
            this.y+=Math.sin(angle);
        
        }
    }
    this.y+=this.vy;
    if(this.y-this.radius<=0 || this.y+this.radius+this.vy>=canvas.height)this.vy*=-1;
    
    this.x+=this.vx;
    if(this.x-this.radius<=0 ||this.x+this.radius+this.vx>=canvas.width)this.vx*=-1;

}
}

class Effect{
constructor(canvas){
    this.canvas=canvas;
    this.width=canvas.width;
    this.height=canvas.height;
   
    this.particles=[];
    this.numberOfparticle=200;
    this.createParticle();
    this.mouse={
        x:0,
        y:0,
        pressed:false,
        radius:150
    };
window.addEventListener('mousemove',event=>{
this.mouse.pressed=true;
if(this.mouse.pressed){
    this.mouse.x=event.x;
    this.mouse.y=event.y;
  
}
}); 
    window.addEventListener('mousedown',event=>{
        this.mouse.pressed=true;
  this.mouse.x=event.x;
    this.mouse.y=event.y;
    });
    window.addEventListener('mouseup',event=>{
this.mouse.pressed=false;
    });

}
createParticle(){
    for(let i=0;i<this.numberOfparticle;i++){
        this.particles.push(new Ball(this));

    }
}

handleParticles(context){
     this.connectParticles(context);
    this.particles.forEach(particle=>{
        particle.draw(context);
        particle.update();
    });
   
 
}

connectParticles(context){
const maxDistance=100;
    for(let a=0;a<this.particles.length;a++){
        for(let b=a;b<this.particles.length;b++){
            const dx=this.particles[a].x-this.particles[b].x;
            const dy=this.particles[a].y-this.particles[b].y;
            const distance=Math.hypot(dx,dy);
            if(distance<maxDistance){
               context.save();
                const opacity=1-(distance/maxDistance);
                context.globalAlpha=opacity;
                context.beginPath();
                context.moveTo(this.particles[a].x,this.particles[a].y);
                context.lineTo(this.particles[b].x,this.particles[b].y);
                context.stroke();
                context.strokeStyle='white';
                context.restore();
        
     
            }

        }
    }


}
}


const effect=new Effect(canvas);


function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize',()=>{
    location.reload();
})



