import styles from "./addForm.module.scss";
import { useState } from "react";
import AddButton from "./add-button";
import coinSelectOptions from "../config/coinSelectOptions";
import fiatSelectOptions from "../config/fiatSelectOptions";
import _ from "lodash";

const AddForm = (props) => {
  const { title, labelName, closeModal, handleFormSubmit, data } = props;

  const defaultData = {
    code: "",
    name: "",
    amount: "",
  };

  const [form, setForm] = useState(defaultData);

  const filteredCoinSelectOptions = () => {
    _.pullAllBy(coinSelectOptions, data, "name");
    return coinSelectOptions;
  };

  const filteredFiatSelectOptions = () => {
    _.pullAllBy(fiatSelectOptions, data, "id");
    return fiatSelectOptions;
  };

  const handleChange = (event) => {
    const target = event.target;
    // set the amount
    if (target.name === "amount") {
      setForm({
        ...form,
        [target.name]: target.value,
      });
    }
    // set coin data
    const wordsArray = _.words(target.value);
    if (target.name === "coin") {
      setForm({
        ...form,
        name: wordsArray[0],
        code: wordsArray[1],
      });
    }
    // set fiat data
    if (target.name === "fiat") {
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
        code: wordsArray.pop(),
        name: wordsArray.join(" "),
        sign: sign,
      });
    }
  };

  const submitForm = () => {
    if (form.amount == 0 || form.code == "" || form.name == "") {
      alert("fields must not be left empty");
      closeModal;
    } else {
      handleFormSubmit({ ...form });
    }
  };

  return (
    <>
      <h1 className={styles.heading}>{title}</h1>
      <hr className={styles.solidDivider} />
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">{labelName}</label>
          <select
            onChange={handleChange}
            // value={form.name}
            name={labelName}
            required
            className={styles.formControl}
            id={labelName}
          >
            <option key={"no option"} disabled selected value hidden>
              -- select an option --
            </option>
            {labelName === "coin"
              ? filteredCoinSelectOptions().map((option) => (
                  <option key={option.name}>
                    {option.name} {option.code}
                  </option>
                ))
              : filteredFiatSelectOptions().map((option) => (
                  <option key={option.id}>
                    {option.fullFiatName} {option.code}
                  </option>
                ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount">amount</label>
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
      </form>
      <AddButton buttonText={"add"} showLogo={false} submitForm={submitForm} />
    </>
  );
};

export default AddForm;
