export const saveState = (state: any) => {
  try {
    const serialState = JSON.stringify(state)
    sessionStorage.setItem("appState", serialState)
  } catch (err) {}
}

export const loadState = () => {
  try {
    const serialState = sessionStorage.getItem("appState")
    if (serialState === null) {
      return undefined
    }
    return JSON.parse(serialState)
  } catch (err) {
    return undefined
  }
}
