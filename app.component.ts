import { HostListener } from '@angular/core';
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div>
  <canvas #myCanvas height=yMax width=xMax ></canvas>
  <button (click)="this.mouseActive = !this.mouseActive"> {{ this.mouseActive ? 'Disable' : 'Enable'}}</button>
</div>`,
})
export class AppComponent {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @HostListener('window:keydown', ['$event.key'])
  move(key: any) {
    switch (key) {
      case 'ArrowUp':
        this.y -= this.speed;
        if (this.y < 0) this.y = 0;
        break;

      case 'ArrowDown':
        this.y += this.speed;
        if (this.y > this.yMax) this.y = this.yMax;
        break;

      case 'ArrowLeft':
        this.x -= this.speed;
        if (this.x < 0) this.x = 0;
        break;

      case 'ArrowRight':
        this.x += this.speed;
        if (this.x > this.xMax) this.x = this.xMax;
        break;
    }
    this.draw();
  }
  @HostListener('window:mousemove', ['$event'])
  move2(e: any) {
    if (!this.mouseActive) return;
    this.x = e.clientX;
    this.y = e.clientY;
    this.draw();
  }
  private ctx: CanvasRenderingContext2D;
  x = 0;
  y = 0;
  speed = 5;
  xMax = 300;
  yMax = 300;
  mouseActive = false;

  size = 20;
  powerups = [];
  doors = [{ x: 170, y: 20, height: 100 - 20, width: 30 }];
  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.draw();
  }

  drawPoint() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'darkred';
    this.ctx.fill();
  }

  drawBorder() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.xMax, 0);
    this.ctx.lineTo(this.xMax, this.yMax);
    this.ctx.lineTo(0, this.yMax);
    this.ctx.lineTo(0, 0);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.fillStyle = 'lightblue';
    this.ctx.fillRect(0, 0, this.xMax, this.yMax / 4);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(0, this.yMax / 4, this.xMax, this.yMax / 3);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.xMax, this.yMax);
    this.drawBorder();
    this.drawDoors();
    this.drawPoint();
    this.drawPowerUps();
  }
  drawPowerUps() {
    if (Math.random() * 100 < 10)
      this.powerups.push({
        id: Math.random(),
        x: Math.floor(Math.random() * this.xMax),
        y: Math.floor(Math.random() * this.yMax),
        width: 5,
        height: 5,
      });
    this.powerups = this.powerups.filter((p, i) => {
      let val = !this.checkCollision(
        { x: this.x, y: this.y, height: this.size, width: this.size },
        p
      );
      if (!val) (this.size += 5), this.drawPoint();
      return val;
    });
    this.powerups.forEach((p, i) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(p.x, p.y, p.width, p.height);
    });
  }
  drawDoors() {
    this.doors.forEach((door) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'brown';
      this.ctx.fillRect(door.x, door.y, door.width, door.height);
    });
  }
  checkCollision = (a, b) =>
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
