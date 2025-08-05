// @flow
import * as React from 'react';
type Props = {
  title: string;
  description?: string;
};
export const PageTitleHeader = (props: Props) => {
  return (
    <section>
      <h2 className="text-2xl font-medium text-[#131B0B]">{props.title}</h2>
      <p className="text-xs font-semibold text-[#7f7f7f]">{props.description}</p>
    </section>
  );
};
