function editOrConfirm(props) {
  const { edit, confirm } = props;
  return (
    <div>
      {edit ? (
        <button onClick={confirm}>Confirm</button>
      ) : (
        <button onClick={edit}>Edit</button>
      )}
    </div>
  );
}

export default editOrConfirm;
