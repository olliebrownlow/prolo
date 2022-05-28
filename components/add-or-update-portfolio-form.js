import styles from "./addForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";
import colourOptions from "../config/portfolioColourOptions";
import _ from "lodash";

const AddOrUpdatePortfolioForm = (props) => {
  const { handleFormSubmit, data, isShown, addButtonText, title } = props;
  const [form, setForm] = useState(data);
  const [isShown2, setIsShown2] = useState(!isShown);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    // set the title and content
    setForm({
      ...form,
      [target.name]: target.value,
    });
  };

  const submitForm = () => {
    if (form.portfolioName === "") {
      toast.error("portfolio name is a required field", {
        id: "blankPortfolioName",
      });
    } else if (
      form.portfolioName === data.portfolioName &&
      form.portfolioDescription === data.portfolioDescription &&
      form.colour === data.colour
    ) {
      toast.error("make changes to trigger an update", {
        id: "noPortfolioChanges",
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
          <label htmlFor="portfolioName">portfolio name*</label>
          <input
            onChange={handleChange}
            name="portfolioName"
            // required
            className={styles.formControl}
            id="portfolioName"
            value={form.portfolioName}
            type="text"
            placeholder="max 12 characters..."
            maxLength="12"
            autoCapitalize="off"
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="portfolioDescription">description (optional)</label>
          <textarea
            onChange={handleChange}
            value={form.portfolioDescription}
            name="portfolioDescription"
            // type="tel"
            required
            className={styles.formControl}
            id="portfolioDescription"
            placeholder="max 50 characters..."
            maxLength="50"
            wrap="hard"
            rows="2"
            cols="20"
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.row}>
            <label className={styles.colourLabel} htmlFor="colour">colour</label>
            <label className={styles.preview}>preview</label>
          </div>
          <div className={styles.row}>
            <select
              onChange={handleChange}
              value={form.colour}
              name="colour"
              className={styles.narrowFormControl}
              id="colour"
            >
              {colourOptions.map((option) => (
                <option key={option.colour}>{option.colour}</option>
              ))}
            </select>
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `${form.colour}` }}
            >
              {form.portfolioName}
            </div>
          </div>
        </div>
      </form>
      <AddButton
        buttonText={addButtonText}
        showLogo={false}
        submitForm={submitForm}
        isShown={isShown2}
        isButtonDisabled={isButtonDisabled}
      />
    </>
  );
};

export default AddOrUpdatePortfolioForm;
