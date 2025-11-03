# PTSC Certificate Verification System

A static website for Programming and Tech Skill Club (PTSC), KNIT Sultanpur to verify and display certificates with download capabilities.

## Features

- **Certificate Verification**: Secure validation using certificate ID and key pairs
- **Professional Display**: Clean, printable certificate layout with PTSC branding  
- **Download Options**: Generate PDF and JPG formats of certificates
- **A4 Optimized**: Certificates sized for A4 landscape printing (297×210mm)
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Offline Capability**: Works without internet after initial load
- **Print Support**: Direct browser printing with optimized layout

## Project Structure

```
ptsc-certificate/
├── index.html          # Landing page with certificate verification form
├── certificate.html    # Certificate display page with download options
├── certificates.json   # Certificate database (client-side)
├── style.css          # Responsive styling with PTSC branding & A4 constraints
├── script.js          # Client-side validation, rendering & download logic
└── README.md          # Project documentation
```

## Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+) - no frameworks required
- **Storage**: Client-side JSON database for certificates
- **Validation**: Secure ID/key pair verification system
- **Download**: html2canvas + jsPDF for certificate generation
- **Sizing**: A4 landscape optimized (1123×794px at 96 DPI)
- **Compatibility**: GitHub Pages ready, works in all modern browsers

## Certificate Structure

Each certificate in `certificates.json` contains:
- `id`: Unique certificate identifier (e.g., "PTSC2025-0123")
- `key`: Validation key for security (e.g., "ABC123DEF456")
- `name`: Recipient's name
- `event`: Event or course name
- `type`: Certificate type (e.g., "Participation", "Achievement")
- `date`: Issue date
- `issuer`: Issuing authority

## 🔧 Setup & Installation

### Local Development

1. **Clone/Download** the repository
2. **Open** `index.html` in a web browser
3. **Test** with provided sample credentials

### GitHub Pages Deployment

1. **Upload** files to a GitHub repository
2. **Enable** GitHub Pages in repository settings
3. **Set** source to main branch
4. **Access** via `https://username.github.io/repository-name`

### Custom Domain (Optional)

1. Add `CNAME` file with your domain
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

## 📝 Usage Guide

### For Certificate Recipients

1. **Visit** the verification website
2. **Enter** your Certificate ID (format: `PTSC2025-XXXX`)
3. **Enter** your Verification Key (10 alphanumeric characters)
4. **Click** "Verify Certificate"
5. **View/Print** your validated certificate
6. **Share** on LinkedIn using the share button

### For Administrators

#### Adding New Certificates

Edit `certificates.json`:

```json
{
  "certificates": [
    {
      "id": "PTSC2025-XXXX",
      "key": "generatekey",
      "name": "Student Name",
      "event": "Event/Workshop Name",
      "type": "Certificate of Merit/Participation",
      "date": "YYYY-MM-DD",
      "issuer": "Faculty Name"
    }
  ]
}
```

#### Certificate ID Format
- Pattern: `PTSC[YEAR]-[4-digit-number]`
- Example: `PTSC2025-0123`

#### Key Generation
- Length: 10 characters
- Characters: Alphanumeric (a-z, A-Z, 0-9)
- Example: `fc92b18e1a`

## 🔒 Security Considerations

### Client-Side Limitations
- Certificate data is stored client-side (in `certificates.json`) and therefore can be inspected by anyone who has access to the files or the served site.
- Any client-side protections (disabling right-click, blocking F12 shortcuts, adding watermarks) are deterrents only — they make casual tampering harder but cannot stop a determined user.

### Protections Implemented in this Project
- Added a subtle, traceable watermark (certificate ID) to downloads to make copied/modified certificates easier to trace.
- Disabled right-click and common devtools keyboard shortcuts on the certificate view to deter casual users from inspecting the DOM.
- Rendered downloads using an off-screen A4-sized clone and high DPI scaling so PDFs/JPGs are crisp and consistently sized across devices (including mobile).

### Stronger Recommendations for Production (server-side)
To properly secure issuance and verification you should move critical logic to a server. Recommended upgrades:
- Server-side verification endpoint that returns only a signed/short-lived token or an image/pdf generated on the server.
- Use signed certificates (for example, HMAC-signed JSON or JWT) so the client cannot fabricate valid data without the server's private key.
- Store certificate metadata in a database and generate PDFs server-side to avoid exposing raw data files (e.g., `certificates.json`).
- Provide a QR code printed on certificates which links to a server verification page — the server confirms authenticity and logs checks.
- Enforce HTTPS, rate limiting, and authentication for administrative operations (adding certificates).

These server-side changes greatly reduce the ability for users to create convincing, forged certificates and allow you to revoke or re-issue certificates centrally.

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Full Support |
| Firefox | 55+ | ✅ Full Support |
| Safari | 12+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |
| IE 11 | - | ⚠️ Limited Support |

## 🎯 Performance

- **First Load**: ~50KB total (HTML + CSS + JS)
- **Certificate Validation**: <1s (local JSON)
- **Mobile Performance**: Optimized for 3G networks
- **Offline Support**: Full functionality after first visit

## 🔧 Customization

### Branding
- Update logo placeholders in HTML
- Modify color scheme in CSS variables
- Change institution details in header sections

### Certificate Layout
- Adjust styling in `.certificate-container` class
- Modify signature sections for different officials
- Update footer branding and verification URLs

### Validation Logic
- Extend certificate data fields in JSON
- Add custom validation rules in JavaScript
- Implement additional security checks

## 📊 Analytics (Optional)

To track usage, add analytics code to both HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the code style
4. Test on multiple devices/browsers
5. Submit a pull request

## 📄 License

© 2025 Programming and Tech Skill Club, KNIT Sultanpur. All rights reserved.

For educational and institutional use. Modify as needed for your organization.

## 📞 Support

For technical issues or questions:

- **Email**: ptsc@knit.ac.in
- **GitHub Issues**: Create an issue in this repository
- **Documentation**: Refer to code comments in source files

## 🔄 Version History

- **v1.0.0** (2025-03-01): Initial release with core functionality
- Features: Certificate validation, responsive design, print support

---

**Built with ❤️ by PTSC, KNIT Sultanpur**