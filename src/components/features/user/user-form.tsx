import { useState, type SubmitEvent } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ErrorText } from "@/components/common/error-text";
import type { Ambulance, Role, User } from "@/types";

type UserFormProps = {
  user?: User;
  ambulances: Ambulance[];
  onSuccess: () => void;
};

// Add a user, or edit one. Leave the password empty to keep the old one.
export function UserForm({ user, ambulances, onSuccess }: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "crew");
  const [ambulanceId, setAmbulanceId] = useState(String(user?.ambulance_id ?? ""));
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = { name, email, password, phone, role, ambulance_id: role === "crew" && ambulanceId ? Number(ambulanceId) : null };

    try {
      if (user) await api.put(`/admin/users/${user.id}`, body);
      else await api.post("/admin/users", body);
      onSuccess();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
      <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
      <Field label={user ? "New password (optional)" : "Password"}>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!user} minLength={8} />
      </Field>
      <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      <Field label="Role">
        <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="crew">Ambulance crew</option>
          <option value="dispatcher">Dispatcher</option>
          <option value="admin">Admin</option>
        </Select>
      </Field>
      {role === "crew" && (
        <Field label="Ambulance">
          <Select value={ambulanceId} onChange={(e) => setAmbulanceId(e.target.value)} required>
            <option value="">Select ambulance</option>
            {ambulances.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
      )}
      <ErrorText message={error} />
      <Button type="submit">{user ? "Save changes" : "Add user"}</Button>
    </form>
  )
}
