import { ErrorMessage, Field, Form, Formik } from "formik"; // 引入 Formik 表单组件，用来简化表单状态管理。
import * as Yup from "yup"; // 引入 Yup，用来声明表单校验规则。

const initialValues = { // 定义表单初始值。
  title: "", // 初始化标题为空。
  description: "", // 初始化描述为空。
  imagesReferences: "", // 初始化图片引用为空，当前版本只存字符串。
  estimatedPrice: 0, // 初始化估计价格为 0，匹配 Troc 表的 estimatedPrice。
}; // 结束 initialValues 定义。

const validationSchema = Yup.object({ // 定义表单校验规则对象。
  title: Yup.string().required("Le titre est obligatoire"), // 标题必填，对应验收标准里的必填字段错误提示。
  description: Yup.string().required("La description est obligatoire"), // 描述必填，对应验收标准里的必填字段错误提示。
  estimatedPrice: Yup.number().min(0, "Le prix estimé doit être positif").required("Le prix estimé est obligatoire"), // 估计价格必须非负且必填。
}); // 结束 validationSchema 定义。

export default function PublishAnnouncementForm({ onSubmit }) { // 定义发布公告表单组件，并从父组件接收提交函数。
  return ( // 返回表单界面。
    <Formik // 使用 Formik 管理表单。
      initialValues={initialValues} // 传入表单初始值。
      validationSchema={validationSchema} // 传入 Yup 校验规则。
      onSubmit={async (values, helpers) => { // 定义表单提交逻辑。
        const payload = { ...values, estimatedPrice: Number(values.estimatedPrice) }; // 把估计价格转换成数字，保证后端能接收 Long。
        const isCreated = await onSubmit(payload); // 调用父组件传入的发布函数。
        if (isCreated) { // 如果后端创建成功。
          helpers.resetForm(); // 清空表单，方便用户继续发布下一条。
        } // 结束创建成功判断。
        helpers.setSubmitting(false); // 无论成功失败都关闭 Formik 提交中状态。
      }} // 结束 onSubmit 配置。
    >
      {({ isSubmitting }) => ( // 读取 Formik 的提交状态。
        <Form className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          {/* 表单容器采用移动端优先样式。 */}
          <div className="mb-4">
            {/* 标题输入区域。 */}
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="title">
              {/* 标题字段标签。 */}
              Titre
            </label>
            {/* 标题输入框。 */}
            <Field className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="title" name="title" placeholder="Ex : Poussette à échanger" />
            {/* 标题错误提示。 */}
            <ErrorMessage className="mt-1 block text-sm text-red-600" component="span" name="title" />
          </div>

          <div className="mb-4">
            {/* 描述输入区域。 */}
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="description">
              {/* 描述字段标签。 */}
              Description
            </label>
            {/* 描述文本框。 */}
            <Field as="textarea" className="min-h-28 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="description" name="description" placeholder="Décrivez l’article et son état général" />
            {/* 描述错误提示。 */}
            <ErrorMessage className="mt-1 block text-sm text-red-600" component="span" name="description" />
          </div>

          <div className="mb-4">
            {/* 估计价格输入区域。 */}
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="estimatedPrice">
              {/* 估计价格字段标签。 */}
              Prix estimé
            </label>
            {/* 估计价格输入框。 */}
            <Field className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="estimatedPrice" min="0" name="estimatedPrice" type="number" />
            {/* 估计价格错误提示。 */}
            <ErrorMessage className="mt-1 block text-sm text-red-600" component="span" name="estimatedPrice" />
          </div>

          <div className="mb-5">
            {/* 图片引用输入区域。 */}
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="imagesReferences">
              {/* 图片引用字段标签。 */}
              Référence image optionnelle
            </label>
            {/* 图片引用输入框。 */}
            <Field className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" id="imagesReferences" name="imagesReferences" placeholder="URL ou référence d’image" />
          </div>

          {/* 发布按钮。 */}
          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300" disabled={isSubmitting} type="submit">
            {/* 根据提交状态显示不同文案。 */}
            {isSubmitting ? "Publication..." : "Publier l’annonce"}
          </button>
        </Form>
      )}
    </Formik>
  ); // 结束 return。
} // 结束 PublishAnnouncementForm 组件。
