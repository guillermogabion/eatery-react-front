import FadeLoader from "react-spinners/FadeLoader"

const ReactLoader = (props: any) => {
  const { isLoading = false } = props
  return (
    <>
      {isLoading ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
          <FadeLoader color="#73bf45" loading={isLoading} height={15} width={5} radius={2} margin={2} />
        </div>
      ) : null}
    </>
  )
}
export default ReactLoader
