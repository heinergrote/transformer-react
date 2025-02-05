import TypeSelect from "./TypeSelect.tsx";
import PointsForm from "./PointsForm.tsx";
import Matrix from "./Matrix.tsx";
import ViewCss from "./ViewCss.tsx";
import ViewSvg from "./ViewSvg.tsx";
import ViewCanvas from "./ViewCanvas.tsx";

function Transformer() {

  return (
    <>
      <TypeSelect/>

      <div className="flex p-4 gap-4">
        <ViewCanvas />
        <ViewCss />
        <ViewSvg />
      </div>

      <div className="flex p-4 gap-8">

        <div>
          <div className="text-xl">Reference Points</div>
          <div className="flex py-2 gap-2">
            <PointsForm target={"src"}  />
            <div className="p-1 text-2xl"> →</div>
            <PointsForm target={"dest"} />
          </div>
        </div>

        <Matrix/>

      </div>

    </>
  )
}

export default Transformer
