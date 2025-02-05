import {Application, FederatedPointerEvent, Graphics} from 'pixi.js';
import {identityMatrix, TransformMatrix} from './homography';
import {XY} from './xy';

export class TransformerView {

  public ready: Promise<any>;
  public app: Application;

  private destCircles: Graphics[] = []
  private srcCircles: Graphics[] = []
  private dragTarget : any;
  private dragSrc : boolean = false;

  private inputs: XY[] = []
  private outputDots: Graphics[] = []

  private srcPoints: XY[] = []
  private destPoints: XY[] = []

  private onSrcPointsChangeCallback: ((xys: XY[]) => void) | null  = null;
  private onDestPointsChangeCallback: ((xys: XY[]) => void) | null  = null;

  constructor() {
    this.app = new Application();
    this.ready = this.initApp();
  }

  async initApp() {

    console.log('init pixi app')

    const app = this.app
    await app.init({ background: "#e5e7eb", width: 400, height: 400, antialias: true});
    app.stage.eventMode = 'static';
    app.stage.hitArea = this.app.screen;
    app.stage.on('pointerup', this.onDragEnd);
    app.stage.on('pointerupoutside', this.onDragEnd);
    //app.ticker.add((ticker) => {
    //  console.log("tick", ticker.deltaMS)
    //});

    const outputPadding = 400;
    const outputSize = 400;
    const outputStep = 20;

    this.inputs = []
    for (let x = -outputPadding; x <= outputSize + outputPadding; x += outputStep) {
      for (let y = -outputPadding; y <= outputSize + outputPadding; y += outputStep) {
        this.inputs.push({x,y})
      }
    }
    this.outputDots = this.inputs.map(
      (_) => {
        return app.stage.addChild(new Graphics().circle(0,0, 2).fill(0x000000));
      }
    )

    console.log('init pixi app... done')
    this.applyTransformation(identityMatrix)

  }

  attach(element: HTMLElement) {
    try {
      console.log('attaching pixi canvas to element', this.app)
      element.replaceChildren(this.app.canvas)
    } catch (e) {
      console.log('error attaching pixi canvas to element (react re-render?)')
    }
  }

  remove(element: HTMLElement) {
    console.log('attaching pixi canvas to element')
    element.removeChild(this.app.canvas)
  }


  destroy() {
    console.log('destroying pixi app', this.app)
    this.app.destroy({removeView: true}, {children: true});
  }


  setCallBacks(onSrcPointsChange: (xys: XY[]) => void,
               onDestPointsChange: (xys: XY[]) => void) {
    this.onSrcPointsChangeCallback = onSrcPointsChange;
    this.onDestPointsChangeCallback = onDestPointsChange
  }


  private initPoints(srcPoints: XY[], destPoints: XY[]) {

    this.app.stage.removeChild(...this.srcCircles)
    this.app.stage.removeChild(...this.destCircles)
    this.srcPoints = srcPoints.slice()
    // fill in missing points with the source points
    this.destPoints = Array.from(srcPoints, (v, k) => destPoints[k] || v)

    this.srcCircles = this.srcPoints.map(point => {
      const cross = this.makeCross()
      this.app.stage.addChild(cross)
      cross.position.set(point.x, point.y)
      return cross
    })

    this.destCircles = this.destPoints.map(point => {
      const handle = this.makeHandle()
      this.app.stage.addChild(handle)
      handle.position.set(point.x, point.y)
      return handle
    })

  }

  updatePoints(newSrcPoints: {x:number, y:number}[], newDestPoints: {x:number, y:number}[]) {
    if (newSrcPoints.length !== this.srcPoints.length) {
      this.initPoints(newSrcPoints, newDestPoints)
    } else {
      this.srcPoints = newSrcPoints
      this.srcPoints = newDestPoints
      newSrcPoints.forEach((point, index) => {
        this.srcCircles[index].position.set(point.x, point.y)
      })
      newDestPoints.forEach((point, index) => {
        this.destCircles[index].position.set(point.x, point.y)
      })
    }
  }

  applyTransformation(tm: TransformMatrix) {

    const outputs = this.inputs.map((input) => {
      const [x, y] = [input.x, input.y]
      const {a,b,c,d,e,f,g, h} = {...tm}
      return {
        x: (a*x+b*y+c) / (g*x+h*y+1),
        y: (d*x+e*y+f) / (g*x+h*y+1)
      } as XY
    })
    outputs.forEach((point, index) => {
      this.outputDots[index].position.set(point.x, point.y)
      this.outputDots[index].zIndex = 0
    })
  }


  makeHandle() {
    const handle = new Graphics().circle(0, 0, 10).fill(0xFF0000).stroke(0x000000);
    handle.alpha = 0.5
    handle.eventMode = 'dynamic';
    handle.cursor = 'pointer';
    handle.on('pointerdown', this.onDstPointerDown)
    return handle
  }

  makeCross() {
    const cross = new Graphics()
      .moveTo(-10, 0).lineTo(-2,0)
      .moveTo(2, 0).lineTo(10,0)
      .moveTo(0, -10).lineTo(0,-2)
      .moveTo(0, 2).lineTo(0,10)
      .circle(0,0, 16)
      .fill({color: 0xFF0000, alpha: 0})
      .stroke(0x000000);
    cross.eventMode = 'dynamic';
    cross.cursor = 'pointer';
    cross.on('pointerdown', this.onSrcPointerDown)
    return cross
  }

  onSrcPointerDown = (event: FederatedPointerEvent) => {
    this.dragTarget = event.target;
    this.dragSrc = true;
    this.app.stage.on('pointermove', this.onDragMove)
  }
  onDstPointerDown = (event: FederatedPointerEvent) => {
    this.dragTarget = event.target;
    this.dragSrc = false;
    this.app.stage.on('pointermove', this.onDragMove)
  }

  onDragMove= (event: FederatedPointerEvent) => {
    if (this.dragTarget) {
      this.dragTarget.parent.toLocal(event.global, null, this.dragTarget.position);

      if (this.dragSrc) {
        this.srcPoints = this.srcCircles.map((circle) => (
          {
            x: Math.round(circle.position.x),
            y: Math.round(circle.position.y)
          } as XY
        ))
        if (this.onSrcPointsChangeCallback) this.onSrcPointsChangeCallback(this.srcPoints)
      } else {
        this.destPoints = this.destCircles.map((circle) => (
          {
            x: Math.round(circle.position.x),
            y: Math.round(circle.position.y)
          } as XY
        ))
        if (this.onDestPointsChangeCallback) this.onDestPointsChangeCallback(this.destPoints)
      }

    }
  }

  onDragEnd = (_: FederatedPointerEvent)=> {
    if (this.dragTarget) {
      this.app.stage.off('pointermove', this.onDragMove);
      this.dragTarget = null;
    }
  }

}
