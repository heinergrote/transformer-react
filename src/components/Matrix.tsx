import {useTransformStore} from "../transformerStore.ts";

function Matrix() {

  const transform = useTransformStore((state) => state.transform)

  return (
    <div>
      <div>
        <div className="text-xl">Projection Matrix</div>
        <div className="py-2 grid grid-cols-3 grid-rows-3 gap-1 w-[30rem]">
          <div>{transform.a.toFixed(7)}</div>
          <div>{transform.b.toFixed(10)}</div>
          <div>{transform.c.toFixed(10)}</div>
          <div>{transform.d.toFixed(10)}</div>
          <div>{transform.e.toFixed(10)}</div>
          <div>{transform.f.toFixed(10)}</div>
          <div>{transform.g.toFixed(10)}</div>
          <div>{transform.h.toFixed(10)}</div>
          <div>{(1).toFixed(10)}</div>
        </div>
      </div>

    </div>
  );
}

export default Matrix;
