import {useTransformStore} from "../transformerStore.ts";

function ViewCss() {

  const transform = useTransformStore((state) => state.transform)

  const cssTransformMatrix3d = () => "matrix3d(" +
    transform.a + ',' + transform.d + ',0,' + transform.g + ',' +
    transform.b + ',' + transform.e + ',0,' + transform.h + ',' +
    '0,0,1,0,' +
    transform.c + ',' + transform.f + ',0,' + transform.i +")"

  return (
    <div>
      <div className="w-[400px] h-[400px] overflow-clip bg-gray-300">

        <div className="w-[400px] h-[400px] bg-gradient-to-br from-blue-700 to-fuchsia-500 text-white"
             style={{position: 'relative',
               transformOrigin: '0 0',
               transform: cssTransformMatrix3d()}}
        >
          <div className="font-bold text-7xl flex flex-col gap-4 p-4 h-full">
            <div>CSS</div>
            <div>transform:</div>
            <div>matrix3d</div>
            <div>👍</div>
          </div>
        </div>

      </div>
      <div>CSS: transform: matrix3d(...)</div>
    </div>
  );
}

export default ViewCss;
