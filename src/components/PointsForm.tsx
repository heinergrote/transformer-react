import {useTransformStore} from "../transformerStore.ts";

type PointsFormProps = {
  target: "src" | "dest",
}

function PointsForm({target}: PointsFormProps) {

  const points =  useTransformStore((state) => target === "src" ? state.srcPoints : state.destPoints)
  const setPoints = useTransformStore((state) => target === "src" ? state.setSrcPoints : state.setDestPoints)

  function onReset(e: React.MouseEvent) {
    e.preventDefault()
    setPoints(null)
  }

  function setPointX(index: number, x: number) {
    const newPoints = points.map(
      (point, i) => i === index ? {...point, x} : point
    )
    setPoints(newPoints)
  }
  function setPointY(index: number, y: number) {
    const newPoints = points.map(
      (point, i) => i === index ? {...point, y} : point
    )
    setPoints(newPoints)
  }

  return (
    <>
      <form className="flex flex-col gap-1">
        {points.map((point, index) =>
            <div className="flex flex-row gap-1" key={index}>
              <input className="w-14 border border-gray-200 p-0.5" id={`x${index}`} type="number"
                     value={point.x}
                     onChange={e => setPointX(index, parseInt(e.target.value)) }
              />
              <input className="w-14 border border-gray-200 p-0.5" id={`y${index}`} type="number"
                     value={point.y}
                     onChange={e => setPointY(index, parseInt(e.target.value)) }
              />
            </div>
        )}
        <button type="button" onClick={onReset} className="border w-14 p-1">Reset</button>
    </form>
    </>
  )

}


export default PointsForm
