// ============================================================
//  JNEET+ AI — components/FreeMockClaimer.jsx
//  After signup / login: if this device finished a Free Quick Mock,
//  move it into the account and open its full result (answers +
//  solutions). Runs once per pending sitting; silent if nothing moves.
// ============================================================
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { freeMockApi, store, FM_PENDING } from "../api/freeMockApi.js";

export function FreeMockClaimer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const busy = useRef(false);

  useEffect(() => {
    const pending = store.get(FM_PENDING);
    if (!user || !pending || !user.hasDateOfBirth || busy.current) return;
    busy.current = true;
    freeMockApi.claim()
      .then(({ data }) => {
        store.del(FM_PENDING);
        if (data.latest) {
          toast.success("Your free mock is saved. Answers and solutions are below.", { duration: 6000 });
          navigate(`/test/result/${data.latest}`);
        } else if (pending.exam && pending.exam !== user.examMode) {
          toast(`Your free mock was ${pending.exam === "JEE" ? "JEE Main" : "NEET UG"}, so it wasn't added to this ${user.examMode} account.`, { duration: 7000 });
        }
      })
      .catch(() => { busy.current = false; }); // try again next time the app opens
  }, [user, navigate]);

  return null;
}
