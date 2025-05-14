const priorityCodes = [
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
];

const otherCodes = [
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+386", name: "Slovenia", flag: "🇸🇮" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰" },
  { code: "+372", name: "Estonia", flag: "🇪🇪" },
  { code: "+370", name: "Lithuania", flag: "🇱🇹" },
  { code: "+371", name: "Latvia", flag: "🇱🇻" },
  { code: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+385", name: "Croatia", flag: "🇭🇷" },
  { code: "+381", name: "Serbia", flag: "🇷🇸" },
  { code: "+994", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "+995", name: "Georgia", flag: "🇬🇪" },
  { code: "+998", name: "Uzbekistan", flag: "🇺🇿" },
];

// Remove duplicates by code+name
const seen = new Set();
const uniqueOtherCodes = otherCodes.filter(c => {
  const key = c.code + c.name;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

uniqueOtherCodes.sort((a, b) => parseInt(a.code.replace('+','')) - parseInt(b.code.replace('+','')));

const countryCodes = [...priorityCodes, ...uniqueOtherCodes];

export default countryCodes; 