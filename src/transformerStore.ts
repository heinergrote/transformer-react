import {
  findHomographyMatrix,
  identityMatrix,
  TransformMatrix,
  TransformType,
  TransformTypeNames
} from './util/homography.ts';
import {create} from 'zustand/react';
import {XY} from './util/xy.ts';

export type TransformerState = {
  transformType: TransformType,
  srcPoints: XY[],
  destPoints: XY[],
  transform: TransformMatrix
  setType: (type: TransformType) => void
  stepType: (steps:number) => void
  setSrcPoints: (points: XY[] | null) => void
  setDestPoints: (points: XY[] | null) => void
}

function mod(n: number, m : number) {
  return ((n % m) + m) % m;
}

function stepType(type: TransformType, steps:number) : TransformType {
  const types = Object.keys(TransformTypeNames) as TransformType[]
  return types[mod(types.indexOf(type) + steps, types.length)]
}

function getDefaultPoints(type: TransformType) : XY[] {

  const padding = 0
  const size = 400

  switch (type) {
    case "perspective":
      return [
        {x: padding, y: padding},
        {x: size-padding, y: padding},
        {x: size-padding, y: size-padding},
        {x: padding, y: size-padding}
      ]
    case "affine":
      return [
        {x: size/2, y: padding},
        {x: size-padding, y: size-padding},
        {x: padding, y: size-padding}
      ]
    case "partialAffine":
      return [
        {x: padding, y: size/2},
        {x: size-padding, y: size/2}
      ]
  }
}

export const useTransformStore = create<TransformerState>((set, get) => ({

  transformType: "perspective",
  srcPoints: getDefaultPoints("perspective"),
  destPoints: getDefaultPoints("perspective"),
  transform: identityMatrix,

  setType: (transformType: TransformType) => set({
    transformType,
    srcPoints: getDefaultPoints(transformType),
    destPoints: getDefaultPoints(transformType),
    transform: findHomographyMatrix(transformType, getDefaultPoints(transformType), getDefaultPoints(transformType))
  }),

  stepType: (steps:number) => {
    get().setType(stepType(get().transformType, steps))
  },

  setSrcPoints: (points: XY[] | null) =>
    set(state => ({
      srcPoints: points || getDefaultPoints(state.transformType),
      transform: findHomographyMatrix(state.transformType, points || getDefaultPoints(state.transformType), state.destPoints)
    })),
  setDestPoints: (points: XY[] | null) =>
    set(state => ({
      destPoints: points || getDefaultPoints(state.transformType),
      transform: findHomographyMatrix(state.transformType, state.srcPoints, points || getDefaultPoints(state.transformType))
    })),
}))

