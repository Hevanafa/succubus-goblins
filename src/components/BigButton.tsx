import React from "react";

export interface IButtonProps {
	className: string;
	clickEvent: (e: React.MouseEvent) => void;

	isSmall?: boolean;
}

interface IState {
	isPressed: boolean;
}
export default class BigButton extends React.Component<IButtonProps, IState> {
	constructor(props: IButtonProps) {
		super(props);

		this.state = {
			isPressed: false
		};

		this.bindMouseMethods();
	}

	bindMouseMethods() {
		this.mouseDownEventHandler = this.mouseDownEventHandler.bind(this);
		this.mouseUpEventHandler = this.mouseUpEventHandler.bind(this);
	}

	mouseDownEventHandler(e: any) {
		this.setState({ isPressed: true });
		this.props.clickEvent(e);
	}

	mouseUpEventHandler(e: any) {
		this.setState({ isPressed: false });
	}

	render() {
		const { className, isSmall } = this.props;

		return (
			<button
				className={
					(isSmall ? "btn-small " : "btn-big ") +
					className +
					(this.state.isPressed ? " pressed" : "")
				}
				onMouseDown={this.mouseDownEventHandler}
				onMouseUp={this.mouseUpEventHandler}
				onTouchStart={this.mouseDownEventHandler}
				onTouchEnd={this.mouseUpEventHandler}>

				{
					isSmall
						? (
							this.state.isPressed
								? <img
									src="/assets/img/btn_small_pressed.png"
									alt="" />
								: <img
									src="/assets/img/btn_small.png"
									alt="" />
						) : (
							// Done: add drop shadow if it's not pressed
							this.state.isPressed
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

