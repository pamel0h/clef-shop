import '../../../css/components/Category.css'; 

const Category = ({
    children,
    onClick,
    icon = null
})=> {
    const baseClass = 'category';
    return(
        <div onClick={onClick}
             className={baseClass}
        >
            {icon && (
                <span>{icon}</span>
            )}
            <p>{children}</p>
        </div>
    )
}

export default Category;
