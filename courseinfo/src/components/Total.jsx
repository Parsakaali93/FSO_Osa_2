
export default function Total({parts}) {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <b><p>Number of exercises {totalExercises}</p></b>
  )
}
