export interface TestNotes {
  short: string;
  medium: string;
  long: string;
  special: string;
  multiline: string;
  unicode: string;
  html: string;
  emoji: string;
}

export const testNotes: TestNotes = {
  short: "GB",
  medium: "This is a test note",
  long: "This is a very long note that should test the character limit of the text field. It contains multiple sentences and should be properly saved and retrieved.",
  special: "Special chars: !@#$%^&*()_+",
  multiline: "Line 1\nLine 2\nLine 3",
  unicode: "Unicode test: 你好, こんにちは, Привет",
  html: "<script>alert('test')</script><p>Test</p>",
  emoji: "Test with emojis 😀 🎉 🌟"
}; 