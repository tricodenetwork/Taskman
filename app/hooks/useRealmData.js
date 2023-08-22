import { Account } from "../models/Account";
import { useSelector } from "react-redux";
import { activejob, job } from "../models/Task";
import { AccountRealmContext } from "../models";
import { useMemo } from "react";
const { useRealm, useQuery, useObject } = AccountRealmContext;

const useRealmData = (routeParams) => {
  const { user } = useSelector((state) => state);
  const { currenttask, handler, password } = useSelector(
    (state) => state.ActiveJob
  );

  const activeJob = useObject(activejob, Realm.BSON.ObjectId(routeParams?.id));
  const Accounts = useQuery(Account);
  const ActiveJobs = useQuery(activejob);
  const tasks = useQuery(job).filtered(`name == "Transcript"`)[0].tasks;
  const handlers = Accounts.filter(
    (obj) =>
      (obj.role == "Handler") & (obj.category?.name == user?.category?.name)
  );
  const account = useQuery("account").filtered(
    `name == $0 AND role == "Handler"`,
    handler
  )[0];
  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    user._id
  );
  const result = useMemo(
    () =>
      ActiveJobs.reduce((acc, params) => {
        const filteredTasks = params.tasks.filter(
          (item) => item.handler == user.name
        );
        return acc.concat(filteredTasks);
      }, []),
    [ActiveJobs]
  );

  const uniqueTasks = useMemo(
    () =>
      result.reduce((unique, task) => {
        if (!unique.some((item) => item.name === task.name)) {
          unique.push(task);
        }
        return unique;
      }, []),
    [result]
  );
  const pushToken = account?.pushToken || "";

  return {
    activeJob,
    Accounts,
    ActiveJobs,
    tasks,
    handlers,
    chatrooms,
    uniqueTasks,
    pushToken,
  };
};

export default useRealmData;