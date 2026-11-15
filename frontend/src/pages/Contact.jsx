// ============================================================
//  JNEET+ AI — pages/Contact.jsx   (public, "Contact us")
//  Contact details (operator, email, Grievance Officer, address/phone
//  when set in legal/content.js) + a contact form. The sender gets a
//  reference number by email; the founder sees it on /admin.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, ShieldCheck, Clock, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { PublicShell, PageHero } from "../components/public/PublicShell.jsx";
import { Captcha } from "../components/security/Captcha.jsx";
import { withCaptcha, CAPTCHA_ERROR } from "../utils/turnstile.js";
import { publicApi } from "../api/publicApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { BUSINESS } from "../legal/content.js";

const TOPICS = [
  ["general", "General question"],
  ["account", "Account or login"],
  ["payment", "Payment or plan"],
  ["bug", "Something is broken"],
  ["content", "Question or content error"],
  ["privacy", "Privacy or my data"],
  ["grievance", "Complaint (Grievance Officer)"],
];

const input = "w-full rounded-xl border border-[#E2DED6] bg-white px-3.5 py-2.5 text-[15px] text-[#17161C] placeholder:text-[#9A96A1] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15";

function Detail(props) {
  const { title, children } = props;
  return (
    <div className="flex gap-3.5">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E6F4F1] text-[#0F766E] flex items-center justify-center"><props.icon size={19} /></div>
      <div className="text-[14.5px] leading-relaxed"><p className="font-semibold text-[#17161C]">{title}</p><div className="text-[#5F5B67]">{children}</div></div>
    </div>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const captchaRef = useRef(null);
  const initialTopic = TOPICS.some(([k]) => k === params.get("topic")) ? params.get("topic") : "general";
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", topic: initialTopic, message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [done, setDone] = useState(null);

  useEffect(() => { document.title = `Contact us — ${BUSINESS.product}`; window.scrollTo(0, 0); }, []);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined, form: undefined })); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10) errs.message = "Please write at least 10 characters.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setState("sending");
    try {
      const res = await publicApi.contact(await withCaptcha(captchaRef, {
        name: form.name.trim(), email: form.email.trim(), topic: form.topic, message: form.message.trim(),
      }));
      setDone(res.data);
    } catch (err) {
      if (err.isCaptchaError) setErrors({ form: CAPTCHA_ERROR });
      else {
        const fe = {};
        for (const f of err.response?.data?.fieldErrors || []) fe[f.field] = f.message;
        setErrors(Object.keys(fe).length ? fe : { form: err.response?.data?.error || "Couldn't send your message. Please try again or email us." });
      }
    } finally { setState("idle"); }
  };

  return (
    <PublicShell>
      <PageHero eyebrow="Contact us" title="Talk to a real person.">
        Questions about your account, a payment, a question you think is wrong, or your data — write to us and we reply within 2 working days.
      </PageHero>
      <div className="max-w-6xl mx-auto px-5 pb-16 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-6">
          <Detail icon={Mail} title="Email">
            <a href={`mailto:${BUSINESS.supportEmail}`} className="text-[#0F766E] font-semibold hover:underline break-all">{BUSINESS.supportEmail}</a>
          </Detail>
          {BUSINESS.phone && <Detail icon={Phone} title="Phone">{BUSINESS.phone}{BUSINESS.phoneHours ? ` (${BUSINESS.phoneHours})` : ""}</Detail>}
          {BUSINESS.address && <Detail icon={MapPin} title="Address">{BUSINESS.address}</Detail>}
          <Detail icon={Clock} title="Response time">Within 2 working days (Monday–Saturday). Payment problems are handled first.</Detail>
          <Detail icon={ShieldCheck} title="Grievance Officer">
            {BUSINESS.grievanceOfficer.name} · <a href={`mailto:${BUSINESS.grievanceOfficer.email}`} className="text-[#0F766E] font-semibold hover:underline break-all">{BUSINESS.grievanceOfficer.email}</a><br />
            Under the IT Rules and the DPDP Act, 2023. Complaints are acknowledged promptly and resolved within one month.
          </Detail>
          <div className="rounded-2xl bg-white border border-[#E7E4DD] p-5 text-[14px] leading-relaxed text-[#5F5B67]">
            <p className="font-semibold text-[#17161C] mb-1">Operated by</p>
            {BUSINESS.operator}{BUSINESS.address ? `, ${BUSINESS.address}` : ", India"}.<br />
            We will never ask for your password or a one-time code — please don't share them with anyone.
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E7E4DD] p-6 sm:p-8 shadow-[0_24px_50px_-35px_rgba(23,22,28,0.35)]">
          {done ? (
            <div className="text-center py-10" role="status">
              <CheckCircle2 size={44} className="mx-auto text-[#0D9488]" />
              <h2 className="mt-4 text-[22px] font-bold">Message sent</h2>
              <p className="mt-2 text-[15px] text-[#5F5B67]">{done.message}</p>
              <p className="mt-1 text-[13.5px] text-[#6E6A76]">A copy with your reference number is on its way to your inbox.</p>
              <Link to="/" className="mt-6 inline-block font-semibold text-[#0F766E] hover:underline">Back to home</Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              <h2 className="text-[20px] font-bold">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[13px] font-semibold text-[#3A3741]">Your name</span>
                  <input className={`${input} mt-1.5`} value={form.name} onChange={set("name")} maxLength={80} autoComplete="name" aria-invalid={!!errors.name} />
                  {errors.name && <span className="text-[12.5px] text-[#B42318]">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-[#3A3741]">Email</span>
                  <input className={`${input} mt-1.5`} type="email" value={form.email} onChange={set("email")} maxLength={254} autoComplete="email" aria-invalid={!!errors.email} />
                  {errors.email && <span className="text-[12.5px] text-[#B42318]">{errors.email}</span>}
                </label>
              </div>
              <label className="block">
                <span className="text-[13px] font-semibold text-[#3A3741]">Topic</span>
                <select className={`${input} mt-1.5`} value={form.topic} onChange={set("topic")}>
                  {TOPICS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[13px] font-semibold text-[#3A3741]">Message</span>
                <textarea className={`${input} mt-1.5 min-h-[150px] resize-y`} value={form.message} onChange={set("message")} maxLength={2000}
                  placeholder={form.topic === "payment" ? "Tell us the date, amount and the Razorpay payment ID from your receipt." : "How can we help?"} aria-invalid={!!errors.message} />
                <span className="flex justify-between text-[12.5px]">
                  <span className="text-[#B42318]">{errors.message || ""}</span>
                  <span className="text-[#9A96A1]">{form.message.length}/2000</span>
                </span>
              </label>
              {errors.form && <p className="text-[13.5px] text-[#B42318]" role="alert">{errors.form}</p>}
              <Captcha ref={captchaRef} />
              <button type="submit" disabled={state === "sending"} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold disabled:opacity-60">
                {state === "sending" ? "Sending…" : "Send message"}
              </button>
              <p className="text-[12.5px] text-[#6E6A76]">We use your details only to reply to you. See our <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
            </form>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
