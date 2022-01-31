import styles from "./addForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";
import _ from "lodash";

const AddOrUpdateNoteForm = (props) => {
  const { title, handleFormSubmit, data, isShown, addButtonText } = props;

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
    if (form.noteContent == "") {
      toast.error("content is a required field", {
        id: "blankNoteContent",
      });
    } else if (
      form.noteContent === data.noteContent &&
      form.noteTitle === data.noteTitle
    ) {
      toast.error("make changes to trigger an update", {
        id: "blankNoteContent",
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
          <label htmlFor="noteTitle">title (optional)</label>
          <input
            onChange={handleChange}
            name="noteTitle"
            // required
            className={styles.formControl}
            id="noteTitle"
            value={form.noteTitle}
            type="text"
            placeholder="max 25 characters..."
            maxLength="25"
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="noteContent">content*</label>
          <textarea
            onChange={handleChange}
            value={form.noteContent}
            name="noteContent"
            // type="tel"
            required
            className={styles.formControl}
            id="noteContent"
            placeholder="max 250 characters..."
            maxLength="250"
            wrap="hard"
            rows="7"
            cols="20"
          />
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

export default AddOrUpdateNoteForm;
