import {
  success_confirm,
  icon_plus_add,
  icon_delete,
  delete_confirm,
  delete_all_confirm,
  am_token_expire,
} from "../../assets/images"

const UserPopup = (props: any) => {
  const { popupClass = "", title, handleClose, popupType = "success", onConfirm, text = "", iconCustom = '', description= "" } = props
  const closePopup = () => {
    handleClose()
  }

  let footerBtn = (
    <button onClick={closePopup} className="btn btn-primary">
      OK
    </button>
  )
  let midContent = <></>
  let iconContent = success_confirm
  if (popupType === "confirm") {
    footerBtn = (
      <>
        <button type="button" onClick={onConfirm} className="addUser">
          {props.confirmBut == 'Confirm' ? null : <img src={icon_plus_add} alt="ADD NEW CLIENT" />}
          {props.confirmBut || "YES DELETE"}
        </button>
        <button type="button" onClick={closePopup} className="deletUser">
          {props.confirmBut == 'Confirm' ? null : <img src={icon_delete} alt="DEACTIVATE CLIENT" />}
          CANCEL
        </button>
      </>
    )
    midContent = (
      <p>
        <strong>{(props.midContent && props.midContent) || ""}</strong>
      </p>
    )
    iconContent = delete_confirm
  } else if (popupType === "clear_all") {
    footerBtn = (
      <>
        <button type="button" onClick={onConfirm} className="clearAll">
          <img src={icon_plus_add} alt="CLEAR ALL" />
          {props.confirmBut || "CLEAR ALL"}
        </button>
        <button type="button" onClick={closePopup} className="cancel">
          CANCEL
        </button>
      </>
    )
    midContent = (
      <p>
        <strong>{props.midContent || props.midContent == "" || "You want to delete this?"}</strong>
      </p>
    )
    iconContent = delete_all_confirm
  } else if (popupType === "oops") {
    iconContent = am_token_expire
    midContent = <p>{text}</p>
  }
  else if (popupType === "expire_password") {
    iconContent = success_confirm
    midContent = <p>{text}</p>
    footerBtn = (
      <button type="button" onClick={onConfirm} className="addUser">
        {"YES, I WANT TO PROCEED"}
      </button>
    )
  }

  const popupClasses = popupClass ? `MessagePopup ${popupClass} open_root` : `MessagePopup open_root`
  return (
    <div id="SuccessPopup" className={popupClasses}>
      <div className="modalBody popup_width">
        <div className="modalmainContent">
          <div className="modalTop">
            <button onClick={closePopup} className="CloseBtn">
              Close
            </button>
          </div>
          <div className="modalContent">
            <div className="sucessContent">
              <img src={iconCustom ? iconCustom : iconContent} alt="cm upload" />
              <h3>{title}</h3>
              {midContent}
              <label>{description}</label>
            </div>
          </div>
          <div className="modalFooter">
            <div className="buttonSet justify_center">{footerBtn}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserPopup
