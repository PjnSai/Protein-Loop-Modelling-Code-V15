/* InputField.jsx - Standardised Form Input Component */

/* InputField Component */
const InputField = ({ label, type, name, value, onChange, disabled, placeholder }) => (
  <div className="mb-3">
    
    {/* Input Label with Accessibility Association */}
    <label htmlFor={name} className="form-label">{label}</label>
    
    {/* Form Input with Bootstrap Styling */}
    <input
      type={type}
      className="form-control"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      placeholder={placeholder}
    />
    
  </div>
);

export default InputField;