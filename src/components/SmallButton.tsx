import React from "react";
import BigButton, { IButtonProps } from "./BigButton";

export default class SmallButton extends React.Component<IButtonProps> {
	render = () =>
		<BigButton
			{...this.props}
			isSmall={true}
			/>
}