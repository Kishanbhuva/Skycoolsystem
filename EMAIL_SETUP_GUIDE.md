# Email Configuration Guide for Sky Cool System Website

All forms across the Sky Cool System website are pre-configured to send inquiries directly to:
**`skycoolsystem2015@gmail.com`**

---

### Option 1: Web3Forms (Recommended - Free, Instant & 2-Minute Setup)

Web3Forms delivers form submissions directly to your inbox without any server backend.

#### Steps:
1. Go to **[https://web3forms.com](https://web3forms.com)**
2. Enter your email: `skycoolsystem2015@gmail.com`
3. Check your Gmail inbox for your **Access Key** (a unique string like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
4. In your HTML files (`index.html`, `contact.html`, `refrigerated-air-dryer.html`, etc.), find:
   ```html
   <input type="hidden" name="access_key" value="a964709c-1663-40da-a1ca-922f2cb8c727">
   ```
5. Replace `a964709c-1663-40da-a1ca-922f2cb8c727` with your actual access key.
6. **Done!** Whenever a customer submits an inquiry, you will receive an instant email notification containing the customer's Name, Phone, Email, Company, Equipment of Interest, and Capacity Requirement.

---

### Option 2: Formspree (Alternative Free Form Endpoint)

1. Go to **[https://formspree.io](https://formspree.io)** and register with `skycoolsystem2015@gmail.com`.
2. Create a new form titled **"Sky Cool System Inquiries"**.
3. Copy your Formspree endpoint URL (e.g., `https://formspree.io/f/xyzabcop`).
4. Update the form action in HTML:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

---

### Built-in Instant WhatsApp Backup

In addition to email routing, the website includes an automated **WhatsApp Quote Generator**:
- When a user submits any inquiry, their data is instantly formatted and ready to send directly to your WhatsApp number **`+91 90333 75597`** with 1-click.
- Floating WhatsApp buttons on every page allow visitors to chat directly with your sales team.
