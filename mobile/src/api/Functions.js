import axios from "axios";
const publicIp = require("react-public-ip");

export const sendUserDetails = async (formdata) => {
  try {
    const res = await axios.post("http://192.168.115.209:2000/user", formdata, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};
export const sendJobDetails = async (formdata) => {
  try {
    const res = await axios.post("http://192.168.115.209:2000/job", formdata, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
  // publicIp.v4().then((ip) => {
  //   console.log(ip);
  // });

  // const ipv4 = (await publicIp.v4()) || "";
  // console.log(ipv4);
};

export const getUserDetails = async (id) => {
  try {
    const res = await axios.get("http://192.168.115.209:2000/user", {
      params: { id: id },
    });
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};
export const getJobDetails = async (id) => {
  try {
    const res = await axios.get("http://192.168.115.209:2000/job", {
      params: { id: id },
    });
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};

export const addTask = async (formdata, id) => {
  // console.log(id);
  // console.log(formdata);
  try {
    const res = await axios.put("http://192.168.115.209:2000/job", formdata, {
      params: { id: id },
    });
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};
export const editUser = async (param) => {
  // console.log(id);
  // console.log(formdata);
  try {
    const res = await axios.patch(
      "http://192.168.115.209:2000/user",
      {
        name: param.name,
        email: param.email,
        phone: param.phone,
        role: param.role,
        dept: param.dept,
        password: param.password,
      },
      {
        params: { id: param.id },
      }
    );
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};
export const editJob = async (param) => {
  // console.log(id);
  // console.log(formdata);
  try {
    const res = await axios.patch(
      "http://192.168.115.209:2000/job",
      {
        name: param.name,
        duration: param.duration,
        category: param.category,
        tasks: param.tasks,
        password: param.no,
      },
      {
        params: { id: param.id },
      }
    );
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};

export const deleteTasks = async (id, name, duration) => {
  // console.log(id);
  // console.log(formdata);
  try {
    const res = await axios.patch(
      "http://192.168.115.209:2000/job/tasks",
      null,
      {
        params: { id: id, name: name, duration: duration },
      }
    );
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};
export const deleteJob = async (id) => {
  // console.log(id);
  // console.log(formdata);
  try {
    const res = await axios.delete("http://192.168.115.209:2000/job", {
      params: { id: id },
    });
    return res.data;
  } catch (err) {
    if (err.status === 500) {
      console.log("there was a problem with the server");
    } else {
      console.log(err || "error from post");
    }
  }
};

export const accounts = [
  {
    id: 1,
    name: "Alhassan Yahaya",
    dept: "Exams and Records",
    role: "ADMIN",
  },
  { id: 2, name: "Owvigho Omotuna", dept: "Fishery", role: "SUPERVISOR" },
  {
    id: 3,
    name: "Patience Utumba",
    dept: "Exams and Records",
    role: "ADMIN",
  },
  {
    id: 4,
    name: "Adams Oshomiole",
    dept: "Political Science",
    role: "HANDLER",
  },
  {
    id: 5,
    name: "Faith Ehikioya",
    dept: "Exams and Records",
    role: "SUPERVISOR",
  },
  {
    id: 6,
    name: "Funsho Ibukun",
    dept: "Mechanical Engineering",
    role: "ADMIN",
  },
  { id: 7, name: "Ese Ilaya", dept: "Social Works", role: "HANDLER" },
  { id: 8, name: "John Snow", dept: "Exams and Records", role: "ADMIN" },
  { id: 9, name: "Otoms Idiom", dept: "Exams and Records", role: "ADMIN" },
  {
    id: 10,
    name: "Gbona Alimosho",
    dept: "Exams and Records",
    role: "SUPERVISOR",
  },
  {
    id: 11,
    name: "Alhassan Yahaya",
    dept: "Exams and Records",
    role: "ADMIN",
  },
  { id: 12, name: "Owvigho Omotuna", dept: "Fishery", role: "SUPERVISOR" },
  {
    id: 13,
    name: "Patience Utumba",
    dept: "Exams and Records",
    role: "ADMIN",
  },
  {
    id: 14,
    name: "Adams Oshomiole",
    dept: "Political Science",
    role: "HANDLER",
  },
  {
    id: 15,
    name: "Faith Ehikioya",
    dept: "Exams and Records",
    role: "SUPERVISOR",
  },
  {
    id: 16,
    name: "Funsho Ibukun",
    dept: "Mechanical Engineering",
    role: "ADMIN",
  },
  { id: 17, name: "Ese Ilaya", dept: "Social Works", role: "HANDLER" },
  { id: 18, name: "John Snow", dept: "Exams and Records", role: "ADMIN" },
  { id: 19, name: "Otoms Idiom", dept: "Exams and Records", role: "ADMIN" },
  {
    id: 20,
    name: "Gbona Alimosho",
    dept: "Exams and Records",
    role: "SUPERVISOR",
  },
];

export const jobDetails = [
  {
    name: "Cross-check scores",
    tasks: 15,
    duration: "2 weeks",
  },
  {
    name: "Vet Transcript",
    tasks: 10,
    duration: "1 week",
  },
  {
    name: "Submit Results",
    tasks: 12,
    duration: "5 days",
  },
];

export function generatePassword(length) {
  var charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  var password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}
