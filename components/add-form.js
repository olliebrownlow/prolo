import styles from "./addForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";
import { byValue, byString } from "sort-es";
import coinSelectOptions from "../config/coinSelectOptions";
import fiatSelectOptions from "../config/fiatSelectOptions";
import _ from "lodash";

const AddForm = (props) => {
  const { title, labelName, handleFormSubmit, data, type, isShown } = props;

  const defaultData = {
    code: "",
    name: "",
  };

  const [form, setForm] = useState(defaultData);
  const [isShown2, setIsShown2] = useState(!isShown);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const filteredOrderedCoinSelectOptions = () => {
    const options = _.differenceBy(coinSelectOptions, data, "name");
    const orderedOptions = options.sort(
      byValue((i) => i.name, byString({ desc: false }))
    );
    return orderedOptions;
  };

  const filteredOrderedFiatSelectOptions = () => {
    const options = _.differenceBy(fiatSelectOptions, data, "id");
    const orderedOptions = options.sort(
      byValue((i) => i.fullFiatName, byString({ desc: false }))
    );
    return orderedOptions;
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

    // remove the square brackets around the code
    const leftBracketRemoved = target.value.replace("[", "");
    const bothBracketsRemoved = leftBracketRemoved.replace("]", "");

    const wordsArray = _.split(bothBracketsRemoved, " ");
    // set coin data
    if (target.name === "coin") {
      setForm({
        ...form,
        code: wordsArray.pop(),
        name: wordsArray.join(" "),
        type: type,
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
    if (form.amount == 0 || (form.amount === undefined && type === "holding")) {
      toast.error("please add a positive amount", {
        id: "blankAmount",
      });
    } else if (form.name == "" || form.code == "") {
      toast.error("please select a currency", {
        id: "blankCurrency",
      });
    } else {
      setIsButtonDisabled(true);
      setIsShown2(true);
      handleFormSubmit({ ...form });
    }
  };

  return (
    <>
      <h1 className={styles.heading}>{title}</h1>
      <hr className={styles.solidDivider} />
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">{labelName}*</label>
          <select
            onChange={handleChange}
            // value={form.name}
            name={labelName}
            required
            className={styles.formControl}
            id={labelName}
          >
            <option key={"no option"} disabled selected value hidden>
              -- select a currency --
            </option>
            {labelName === "coin"
              ? filteredOrderedCoinSelectOptions().map((option) => (
                  <option key={option.name}>
                    {option.name} {option.code}
                  </option>
                ))
              : filteredOrderedFiatSelectOptions().map((option) => (
                  <option key={option.id}>
                    {option.fullFiatName} {option.code}
                  </option>
                ))}
          </select>
        </div>
        {type !== "monitoring" && (
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
        )}
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

export default AddForm;
