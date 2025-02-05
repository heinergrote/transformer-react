import {useEffect, useLayoutEffect, useRef} from "react";
import {TransformerView} from "../util/transformer-view.ts";
import {useTransformStore} from "../transformerStore.ts";

let globalTransformerView: TransformerView | null = null

function ViewCanvas() {

  const srcPoints = useTransformStore((state) => state.srcPoints)
  const destPoints = useTransformStore((state) => state.destPoints)
  const setSrcPoints = useTransformStore((state) => state.setSrcPoints)
  const setDestPoints = useTransformStore((state) => state.setDestPoints)
  const transform = useTransformStore((state) => state.transform)

  const viewContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewContainer = viewContainerRef.current
    if (globalTransformerView === null) {
      console.log("creating TransformerView" , viewContainerRef.current)
      globalTransformerView = new TransformerView()

      globalTransformerView.ready.then(
        () => {
          if(viewContainer) globalTransformerView?.attach(viewContainer)
        },
        (err) => {
          console.error("Error creating TransformerView", err)
        }
      )

    } else {
      if(viewContainer) globalTransformerView.attach(viewContainer)
    }


  }, []);

  useEffect(() => {
    globalTransformerView?.setCallBacks(setSrcPoints, setDestPoints)
  }, [setSrcPoints, setDestPoints])

  useEffect(() => {
    globalTransformerView?.updatePoints(srcPoints, destPoints)
  }, [srcPoints, destPoints]);

  useEffect(() => {
    globalTransformerView?.applyTransformation(transform)
  }, [transform])


  return (
    <div>
      <div ref={viewContainerRef} className="w-[400px] h-[400px] bg-gray-200"></div>
      <div>Canvas/WebGL Drawing</div>
    </div>
  );
}

export default ViewCanvas;
