import './Product.css';
import React from 'react';
import { MouseEvent } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import { EnumAction, EventButton, EnumDataType, ProductType } from 'src/api/models';
import { useEffect, useState } from 'react';
import Table from 'src/components/Table/Table';
import ProductDetails from './ProductDetails/ProductDetails';
import { useNavigate } from 'react-router-dom';
import ProductGift from './ProductGift/ProductGift';
import { useGetAttributeList, useGetProductCategory } from 'src/api/productCategoryApi';
import { useGetProduct, useDeleteProduct } from 'src/api/productApi';
import { useGetProductRealm } from 'src/api/productRealmApi';
import { BASE_WEB_URL } from 'src/constants';
import ProductExcel from './ProductExcel/ProductExcel';
import ProductImportImages from './ProductImages/ProductImportImages/ProductImportImages';
import { TableColumnType } from 'src/components/Table/TableHeader/TableHeader';
import useModal from 'src/hooks/useModal';
import { FilterType } from 'src/components/FilterBox/FilterOptionBox';
import ToolBar from 'src/components/ToolBar/ToolBar';
import useDebounce from 'src/hooks/useDebounce';
import ConfirmModal from 'src/components/ConfirmModal/ConfirmModal';
import { useGetStaticPageByKey } from 'src/api/staticPageApi';
import { EnumViewType } from 'src/common/enum/EnumViewType';

// window.addEventListener('contextmenu', (e) => e.preventDefault());

//Category
const Product: React.FC = () => {
  //Value

  const REALM_FILTER = 'realm';
  const REALM_FIELD_FILTER = 'productRealmId';

  const CATEGORY_FILTER = 'category';
  const CATEGORY_FIELD_FILTER = 'productCategoryId';

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [keyword, setKeyword] = useState<string>();
  const [realmIds, setRealmIds] = useState<number[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterType<object>[]>([]);
  const [sortField, setSortField] = useState('displayOrder');
  const [sortOrder, setSortOrder] = useState('asc');
  const keywordDebound = useDebounce(keyword, 1000);

  const navigate = useNavigate();
  //Function
  const addPopup = useAddPopup();
  const getProduct = useGetProduct();
  const getRealm = useGetProductRealm();
  const getProductCategory = useGetProductCategory();
  const deleteProduct = useDeleteProduct();
  const getAttributeList = useGetAttributeList();
  const getStaticPage = useGetStaticPageByKey();

  const [reloadFlag, setReloadFlag] = useState(false);

  const detailModal = useModal(ProductDetails);
  const giftModal = useModal(ProductGift);
  const importImageModal = useModal(ProductImportImages);
  const excelModal = useModal(ProductExcel);
  const confirmModal = useModal(ConfirmModal);

  const [items, setItems] = useState([]);
  const [count, setCount] = useState<number>();

  const [header, setHeader] = useState<TableColumnType[]>([
    {
      code: 'displayOrder',
      dataType: EnumDataType.Int,
      isOptions: false,
      title: 'Thứ tự',
      cellCss: {
        textAlign: 'center',
      },
    },
    {
      code: 'productCategoryName',
      dataType: EnumDataType.Text,
      isOptions: false,
      title: 'Tên danh mục sản phẩm',
    },
    {
      code: 'productCode',
      dataType: EnumDataType.Text,
      isOptions: false,
      title: 'Mã sản phẩm',
    },
    {
      code: 'productName',
      dataType: EnumDataType.Text,
      isOptions: false,
      title: 'Tên sản phẩm',
    },
    {
      code: 'stopSelling',
      dataType: EnumDataType.Boolean,
      isOptions: false,
      title: 'Ngừng bán',
    },
    {
      code: 'price',
      dataType: EnumDataType.Decimal,
      isOptions: false,
      title: 'Giá tiền',
    },
  ]);

  useEffect(() => {
    Promise.all([getAttributeList(), getRealm(), getProductCategory()]).then(
      ([attributes, realms, categories]) => {
        attributes.forEach((attribute) => {
          header.push({
            code: attribute.attributeName,
            dataType: attribute.attributeType,
            isOptions: false,
            title: attribute.attributeTitle,
          });
        });
        setHeader([...header]);
        setFilters([
          {
            data: realms,
            valueField: REALM_FIELD_FILTER,
            titleField: 'productRealmName',
            title: 'Loại SP',
            filterKey: REALM_FILTER,
          },
          {
            data: categories,
            valueField: CATEGORY_FIELD_FILTER,
            titleField: 'productCategoryName',
            title: 'Danh mục SP',
            filterKey: CATEGORY_FILTER,
          },
          {
            data: [
              { id: 'displayOrder:asc', name: 'Thứ tự (Tăng dần)' },
              { id: 'displayOrder:desc', name: 'Thứ tự (Giảm dần)' },
              { id: 'createdAt:desc', name: 'Ngày tạo (Mới nhất)' },
              { id: 'createdAt:asc', name: 'Ngày tạo (Cũ nhất)' },
              { id: 'price:desc', name: 'Giá bán (Giảm dần)' },
              { id: 'price:asc', name: 'Giá bán (Tăng dần)' }
            ],
            valueField: 'id',
            titleField: 'name',
            title: 'Sắp xếp',
            filterKey: 'sort',
          }
        ]);
      },
    );
  }, []);

  useEffect(() => {
    getProduct(keyword ?? '', page, size, realmIds, categoryIds, undefined, sortField, sortOrder)
      .then((data) => {
        setCount(data.count);
        setItems(data.items);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [
    getProduct,
    reloadFlag,
    keywordDebound,
    page,
    size,
    realmIds,
    categoryIds,
    keyword,
    sortField,
    sortOrder,
    addPopup,
  ]);

  //Menucontext
  const onView = (productId: number) => {
    detailModal.handlePresent(
      {
        productId: productId,
        isDisable: true,
      },
      'CHI TIẾT',
    );
  };

  const onEdit = (productId: number) => {
    detailModal.handlePresent(
      {
        productId: productId,
        isDisable: false,
        postProcess: (data: ProductType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.productId);
        },
      },
      'THAY ĐỔI',
    );
  };

  const onDelete = (productId: number) => {
    const onConfirm = () => {
      deleteProduct(productId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa sản phẩm thành công',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
        })
        .finally(() => setReloadFlag(!reloadFlag));
    };

    const listButton: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: onConfirm,
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    confirmModal.handlePresent(
      {
        question: 'Bạn có chắc muốn xóa sản phẩm này?',
        listActionButton: listButton,
        postProcess: confirmModal.handleDismiss,
      },
      'XÓA SẢN PHẨM',
    );
  };

  const onStock = (productId: number) => {
    if (productId && productId > 0) {
      const url = `${BASE_WEB_URL}/product/${productId}/product-serial`;
      navigate(url);
    }
  };

  const onDetail = (productId: number) => {
    if (productId && productId > 0) {
      const url = `${BASE_WEB_URL}/product/${productId}`;
      navigate(url);
    }
  };

  const onGiftConfig = (productId: number) => {
    giftModal.handlePresent(
      {
        productId: productId,
      },
      'CHỈNH SỬA QUÀ TẶNG',
    );
  };

  const menuContext = (item: ProductType) => [
    {
      name: 'Chi tiết',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => onDetail(item.productId),
      buttonClass: 'info',
      align: 'left',
    },
    {
      name: 'Chi tiết tồn kho',
      icon: 'info',
      actionType: EnumAction.Edit,
      action: () => onStock(item.productId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Sửa',
      icon: 'auto_fix_high',
      actionType: EnumAction.Edit,
      action: () => onEdit(item.productId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Xóa',
      icon: 'delete',
      actionType: EnumAction.Edit,
      action: () => onDelete(item.productId),
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Sửa bài viết',
      icon: 'settings',
      actionType: EnumAction.Edit,
      action: () => {
        if (item.introContent) {
          getStaticPage(item.introContent).then((res) => {
            navigate(`${BASE_WEB_URL}/static-page/${EnumViewType.Edit}/id/${res.staticPageId}`);
          });
        }
      },
      buttonClass: 'info',
      align: '',
    },
    {
      name: 'Cấu hình quà tặng',
      icon: 'settings',
      actionType: EnumAction.Edit,
      action: () => onGiftConfig(item.productId),
      buttonClass: 'info',
      align: '',
    },
  ];

  //Function in the listButton
  const onAddProductNew = (e: MouseEvent) => {
    detailModal.handlePresent(
      {
        isDisable: false,
        postProcess: (data: ProductType) => {
          detailModal.handleDismiss();
          setReloadFlag(!reloadFlag);
          onView(data.productId);
        },
      },
      'THÊM MỚI',
    );
  };

  const onOpenPopupProductImages = () => {
    importImageModal.handlePresent({}, 'IMPORT ẢNH SẢN PHẨM');
  };

  const onOpenPopupProductExcel = () => {
    excelModal.handlePresent({}, 'EXCEL');
  };

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Thêm',
      icon: 'add',
      actionType: EnumAction.Add,
      buttonClass: 'info sim-order-tool-btn',
      action: onAddProductNew,
      align: 'center',
    },
    {
      name: 'Ảnh và avatar',
      icon: 'image',
      actionType: EnumAction.View,
      buttonClass: 'info100 sim-order-tool-btn',
      action: onOpenPopupProductImages,
      align: 'center',
    },
    {
      name: 'Excel',
      icon: 'view_list',
      actionType: EnumAction.View,
      buttonClass: 'info sim-order-tool-btn',
      action: onOpenPopupProductExcel,
      align: 'center',
    },
  ];

  const onFilter = (res: { [filterKey: string]: any }) => {
    if (res[REALM_FILTER] != undefined) {
      const realmId = res[REALM_FILTER][REALM_FIELD_FILTER];
      setRealmIds([realmId]);
    } else {
      setRealmIds([]);
    }
    if (res[CATEGORY_FILTER] != undefined) {
      const categoryId = res[CATEGORY_FILTER][CATEGORY_FIELD_FILTER];
      setCategoryIds([categoryId]);
    } else {
      setCategoryIds([]);
    }
    
    if (res['sort'] != undefined) {
      const sortVal = res['sort']['id'];
      const [field, order] = sortVal.split(':');
      setSortField(field);
      setSortOrder(order);
    } else {
      setSortField('displayOrder');
      setSortOrder('asc');
    }
  };

  return (
    <>
      <ToolBar
        toolbarName={'Sản phẩm'}
        listRightButton={listButton}
        width={'100%'}
        backgroundColor={'#ebe9e9'}
        count={count}
        onFilter={onFilter}
        onSearch={(value) => setKeyword(value)}
        onChangePage={setPage}
        onChangeSize={setSize}
        keyword={keyword}
        page={page}
        size={size}
        isPaging={true}
        filters={filters}
      />

      <Table
        display={{
          header: header,
        }}
        isInput={false}
        data={items}
        menuContext={menuContext}
        onDoubleClick={(item) => onView(item.productId)}
      />
    </>
  );
};
export default Product;
