import PixelSheet from "./PixelSheet";
import {
  SCENES,
  SCENE_H,
  SCENE_W,
  compose,
  type SceneKey,
} from "../../lib/pixel-scenes";

/** A looping sprite animation for one task, sized for a dataset card. */
export default function TaskPixelScene({
  scene,
  seed = 0,
}: {
  scene: SceneKey;
  /** Offsets the loop so a grid of cards doesn't march in lockstep. */
  seed?: number;
}) {
  const { statics, frames } = SCENES[scene];

  return (
    <PixelSheet
      w={SCENE_W}
      h={SCENE_H}
      statics={compose(statics)}
      frames={frames.map((frame) => compose(frame))}
      delay={(seed % 5) * 0.37}
    />
  );
}
