import { Leckerli_One } from 'next/font/google';

const leckerliOne = Leckerli_One({
  style: 'normal',
  weight: '400',
  subsets: ['latin'],
});

export function Logo() {
  return (
    <span data-test="logo-text" className={leckerliOne.className}>
      you-say
    </span>
  );
}
