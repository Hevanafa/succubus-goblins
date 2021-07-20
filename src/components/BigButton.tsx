import React from "react";

export interface IButtonProps {
	className: string;
	mouseUpEventHandler: (e: any) => void;
	mouseDownEventHandler: (e: any) => void;
	isPressed: boolean;
	
	/** The name for clickEvent currentTarget */
	name: string;

	/** Optional: only used in SmallButton */
	isSmall?: boolean;
}

// interface IState {
// 	isPressed: boolean;
// }
export default class BigButton extends React.Component<IButtonProps> {
	// constructor(props: IButtonProps) {
	// 	super(props);

		// this.state = {
		// 	isPressed: false
		// };

		// this.bindMouseMethods();
	// }

	// bindMouseMethods() {
	// 	this.mouseDownEventHandler = this.mouseDownEventHandler.bind(this);
	// 	this.mouseUpEventHandler = this.mouseUpEventHandler.bind(this);
	// }

	// mouseDownEventHandler(e: any) {
	// 	this.props.clickEvent(e);
	// 	this.setState({ isPressed: true });
	// }

	// mouseUpEventHandler(e: any) {
	// 	this.setState({ isPressed: false });
	// }

	render() {
		const {
			className,
			isPressed,
			isSmall,
			name,

			mouseDownEventHandler,
			mouseUpEventHandler
		} = this.props;
		// const { isPressed } = this.state;

		return (
			<button
				className={
					(isSmall ? "btn-small " : "btn-big ") +
					className +
					(isPressed ? " pressed" : "")
				}
				name={name}
				// onMouseDown={this.mouseDownEventHandler}
				// onMouseUp={this.mouseUpEventHandler}
				onTouchStart={mouseDownEventHandler}
				onTouchEnd={mouseUpEventHandler}>

				{
					isSmall
						? (
							isPressed
								? <img
									src="/assets/img/btn_small_pressed.png"
									alt="" />
								: <img
									src="/assets/img/btn_small.png"
									alt="" />
						) : (
							// Done: add drop shadow if it's not pressed
							isPressed
								? <img
									src="/assets/img/btn_big_pressed.png"
									alt="" />
								: <img
									src="/assets/img/btn_big.png"
									alt="" />
						)
				}

			</button>
		);
	}
}

