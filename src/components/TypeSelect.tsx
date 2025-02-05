import {TransformType, TransformTypeNames} from "../util/homography.ts";
import {useTransformStore} from "../transformerStore.ts";

const types = Object.keys(TransformTypeNames) as TransformType[]

function TypeSelect() {
  const transformType = useTransformStore((state) => state.transformType )
  const setType = useTransformStore((state) => state.setType )
  const stepType = useTransformStore((state) => state.stepType )

  return (
    <>
      <div className="flex gap-1 mx-4 pt-2">
        <button className="border px-4 py-1" onClick={() => stepType(-1)}> ← </button>
        {
          types.map((type, index) =>
            <button className={`border px-4 py-1 ` + (type === transformType ? "font-bold" : "")}
                    key={index}
                    onClick={() => {setType(type)}
            }>{TransformTypeNames[type]}</button>
          )
        }
        <button className="border px-4 py-1" onClick={() => stepType(1)}> → </button>
      </div>

    </>
  )

}

export default TypeSelect
