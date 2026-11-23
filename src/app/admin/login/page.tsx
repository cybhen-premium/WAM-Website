"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogIn, ArrowLeft } from "lucide-react";
import styles from "./Login.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFillDemo = () => {
    setEmail("admin@worldarkmissions.org");
    setPassword("admin123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.brandHeader}>
          <Image 
            src="https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477247/world-ark-missions/logo.png" 
            alt="World Ark Missions Official Crest" 
            width={64} 
            height={64} 
            className={styles.logo}
            priority
          />
          <div>
            <h1 className={styles.title}>Admin Console</h1>
            <p className={styles.subtitle}>Sign in to manage World Ark Missions platform</p>
          </div>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className={styles.demoBanner}>
          <div className={styles.demoHeader}>
            <span>Default Administrator Access</span>
            <button type="button" onClick={handleFillDemo} className={styles.fillBtn}>
              Auto-fill
            </button>
          </div>
          <div className={styles.demoInfo}>
            Email: admin@worldarkmissions.org<br />
            Password: admin123
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@worldarkmissions.org"
              autoComplete="email"
            />
          </div>
          
          <div className={styles.field}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            <LogIn size={18} />
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          ← Return to public website
        </Link>
      </div>
    </div>
  );
}
