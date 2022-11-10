import "./WidgetBar.css";

function WidgetBar(props) {
	return (
		<div className="WidgetBar">
			<div className="InnerWrapper">
				<div className="InnerContainer">{props.children}</div>
			</div>
		</div>
	);
}

export default WidgetBar;
