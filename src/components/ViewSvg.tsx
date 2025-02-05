import {useTransformStore} from "../transformerStore.ts";


function ViewSvg() {

  const transformType = useTransformStore((state) => state.transformType)
  const transform = useTransformStore((state) => state.transform)

  const svgTransformMatrix = () => "matrix(" +
    transform.a + " " + transform.d + " " + transform.b + " " +
    transform.e + " " + transform.c + " " + transform.f + ")"

  return (
    <div>
      {(transformType === "perspective") ?
        <div className="w-[400px] h-[400px] overflow-clip bg-gray-300 p-8 font-bold text-xl text-gray-500">
          Type "perpective" not supported with svg tranform
        </div>
        :
        <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="400" fill="#d1d5db"/>
          <g transform={svgTransformMatrix()}>
            <rect x="0" y="0" width="400" height="400" fill="#C22"/>
            <circle r="10" cx="200" cy="25" stroke="white" strokeWidth="4" fill="white"/>
            <circle r="10" cx="375" cy="200" stroke="white" strokeWidth="4" fill="transparent"/>
            <circle r="10" cx="200" cy="375" stroke="white" strokeWidth="4" fill="transparent"/>
            <circle r="10" cx="25" cy="200" stroke="white" strokeWidth="4" fill="transparent"/>
            <path d="M 150 150 L 250 150 L 250 250 L 150 250 Z" fill="none" stroke="white" strokeWidth="4"/>
            <path d="M 100 100 L 300 100 L 300 300 L 100 300 Z" fill="none" stroke="white" strokeWidth="4"/>
            <path d="M 50 50 L 350 50 L 350 350 L 50 350 Z" fill="none" stroke="white" strokeWidth="4"/>
          </g>
        </svg>
      }

      <div>SVG: transform="matrix(...)"</div>
    </div>
  )
}

export default ViewSvg;
