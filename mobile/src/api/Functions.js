import axios from "axios";

export const postData = async (formdata) => {
  console.log("posted");
  try {
    const res = await axios.post(
      "http://192.168.178.209:5000/new_user",
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};

export const submit = () => {
  // e.preventDefault();
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("password", password);
  postData(formdata);

  // setName("");
  // setPassword('');
};
