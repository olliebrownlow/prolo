import styles from "./addForm.module.scss";
import { useState } from "react";
import AddButton from "./add-button";
import _ from "lodash";

const AddNoteForm = (props) => {
  const { title, closeModal, handleFormSubmit, data, isShown } = props;

  const defaultData = {
    id: data,
    noteTitle: "",
    noteContent: "",
  };

  const [form, setForm] = useState(defaultData);
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
    if ( form.noteContent == "") {
      alert("content field must not be left empty");
      closeModal;
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
          <label htmlFor="noteTitle">title (optional)</label>
          <input
            onChange={handleChange}
            name="noteTitle"
            // required
            className={styles.formControl}
            id="noteTitle"
            // value={form.noteTitle}
            type="text"
            placeholder="max 25 characters..."
            maxLength="25"
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="noteContent">content (max 250 characters)</label>
          <textarea
            onChange={handleChange}
            // value={form.noteContent}
            name="noteContent"
            // type="tel"
            required
            className={styles.formControl}
            id="noteContent"
            placeholder="important info: held on coin exchange x..."
            maxLength="250"
            wrap="hard"
            rows="5"
            cols="50"
          />
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

export default AddNoteForm;
