import '../styles/globals.css'; // এই পাথটি কি আপনার ফোল্ডার অনুযায়ী ঠিক আছে?

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}