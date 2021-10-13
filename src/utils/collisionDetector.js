// @flow
export default function (map, id, nextPosition) {
  let collision = false;

  if (
    (nextPosition.x < 0 || nextPosition.x > 15)
    || (nextPosition.y < 0 || nextPosition.y > 30)
  ) {
    collision = { component: null };
  }

  map.forEach((component) => {
    if (
      !collision
      && component.id !== id
      && (component.x === nextPosition.x && component.y === nextPosition.y)
    ) {
      collision = { component };
    }
  });

  return collision;
}
