import styles from "./addForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";
import _ from "lodash";

const AddInvestmentItemForm = (props) => {
  const { handleFormSubmit, isShown } = props;

  const defaultData = {
    id: "",
    date: "",
    type: "",
    amount: "",
    currencyName: "",
    currencyCode: "",
    currencySign: "",
    euros: "",
    britishSterling: "",
    americanDollars: "",
  };

  const [form, setForm] = useState(defaultData);
  const [isShown2, setIsShown2] = useState(!isShown);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    // set the amount and type
    if (target.name === "amount" || target.name === "type") {
      setForm({
        ...form,
        [target.name]: target.value,
      });
    }
    // set the date
    if (target.name === "date") {
      var unFormattedDate = target.value;
      const formattedDate = unFormattedDate.replace(/\//g, "-");
      setForm({
        ...form,
        [target.name]: formattedDate,
      });
    }
    // set currency data
    if (target.name === "currency") {
      const wordsArray = _.words(target.value);
      let sign = "";
      if (wordsArray[0] === "euros") {
        sign = "€";
      } else if (wordsArray[0] === "american") {
        sign = "$";
      } else if (wordsArray[0] === "british") {
        sign = "£";
      } else {
        sign = "";
      }
      setForm({
        ...form,
        currencyCode: wordsArray.pop(),
        currencyName: wordsArray.join(" "),
        currencySign: sign,
      });
    }
  };

  const isFutureDated = (date) => {
    const now = new Date();
    const yr = now.getFullYear();
    const mnth = now.getMonth() + 1;
    const dy = now.getDate();

    const dateArray = date.split("-").map(Number);
    if (dateArray[0] >= yr) {
      if (dateArray[0] > yr) {
        return true;
      } else {
        // same year
        if (dateArray[1] >= mnth) {
          if (dateArray[1] > mnth) {
            return true;
          } else {
            // same year and month
            if (dateArray[2] > dy) {
              return true;
            }
          }
        }
      }
    }
  };

  const submitForm = () => {
    if (
      form.amount == 0 ||
      form.date == "" ||
      form.currencyName == "" ||
      form.type == ""
    ) {
      toast.error("make sure all fields have a value", {
        id: "blankItemField",
      });
    } else if (isFutureDated(form.date)) {
      toast.error("cannot add future-dated items", {
        id: "futureDatedItem",
      });
    } else {
      setIsButtonDisabled(true);
      handleFormSubmit({ ...form });
      setIsShown2(true);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>add funding history item</h1>
      <hr className={styles.solidDivider} />
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="type">type*</label>
          <select
            onChange={handleChange}
            // value={form.type}
            name="type"
            required
            className={styles.formControl}
            id="type"
          >
            <option key={"no option"} disabled selected hidden>
              -- select a type --
            </option>
            <option key="1">investment</option>
            <option key="2">withdrawal</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="currency">currency*</label>
          <select
            onChange={handleChange}
            // value={form.currency}
            name="currency"
            required
            className={styles.formControl}
            id="currency"
          >
            <option key={"no option"} disabled selected hidden>
              -- select a currency --
            </option>
            <option key="1">american dollars [USD]</option>
            <option key="2">british sterling [GBP]</option>
            <option key="3">euros [EUR]</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount">amount*</label>
          <input
            onChange={handleChange}
            value={form.amount}
            name="amount"
            type="tel"
            required
            className={styles.formControl}
            id="amount"
            placeholder="2.7865..."
            maxLength="12"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="date">date*</label>
          <input
            className={styles.formControl}
            onChange={handleChange}
            // onFocus={type='date'}
            type="date"
            placeholder="dd/mm/yyyy"
            id="date"
            name="date"
            required
          ></input>
        </div>
      </form>
      <AddButton
        buttonText={"add"}
        showLogo={false}
        submitForm={submitForm}
        isShown={isShown2}
        isButtonDisabled={isButtonDisabled}
      />
    </>
  );
};

export default AddInvestmentItemForm;
