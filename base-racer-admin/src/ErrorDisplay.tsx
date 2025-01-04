export default ({ children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                userSelect: 'text',
            }}
        >
            <h2>An Error Occurred!</h2>
            <div>{children}</div>
        </div>
    )
}
