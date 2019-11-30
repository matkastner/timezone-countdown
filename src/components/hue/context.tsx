import React from "react";
import { Subtract } from "utility-types";

const HueContext = React.createContext<any | null>(null);

export interface InjectedHueProps {
  bridge: any;
}

export const withHueBridge = <P extends InjectedHueProps>(
  Component: React.ComponentType<P>
): React.FC<Subtract<P, InjectedHueProps>> => ({ ...props }) => (
  <HueContext.Consumer>
    {value => <Component {...(props as P)} bridge={value} />}
  </HueContext.Consumer>
);

// export const withHueBridge = <P extends object>(
//   Component: React.ComponentType<P>
// ) =>
//   class WithHueBridge extends React.Component<P & WithHueBridgeProps> {
//     render() {
//       const { ...props } = this.props;

//       return (
//         <HueContext.Consumer>
//           {value => <Component bridge={value} {...(props as P)} />}
//         </HueContext.Consumer>
//       );
//     }
//   };

export default HueContext;
