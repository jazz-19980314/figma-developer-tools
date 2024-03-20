import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import FrameInfoInput from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/FrameInfoInput',
  component: FrameInfoInput,

} as Meta<typeof FrameInfoInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof FrameInfoInput> = (args: any) => <FrameInfoInput {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  placeholder: "Search",
  searchInputRef: React.createRef(),
  onChange: () => {}
};