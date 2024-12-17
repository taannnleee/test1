'use client'
import React from "react";
import { Box, Typography, Paper, Divider, Grid } from "@mui/material";

const About: React.FC = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Giới Thiệu Về Chúng Tôi
            </Typography>

            {/* Giới thiệu về cửa hàng */}
            <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3, borderRadius: '12px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            Chào mừng bạn đến với cửa hàng dụng cụ tập yoga của chúng tôi!
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                            Tại cửa hàng của chúng tôi, chúng tôi cung cấp các sản phẩm dụng cụ tập yoga chất lượng cao giúp bạn cải thiện sức khỏe và tinh thần. Mỗi sản phẩm được chọn lọc kỹ lưỡng, đảm bảo mang lại trải nghiệm tốt nhất cho người dùng.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                            Chúng tôi không chỉ cung cấp những sản phẩm chất lượng mà còn mang đến một cộng đồng yêu yoga, nơi bạn có thể tìm thấy các tài liệu, khóa học và các thông tin hữu ích để nâng cao kỹ năng tập luyện.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img
                            src="https://bizweb.dktcdn.net/100/262/937/files/do-tap-yoga-tot.jpg?v=1582208511714"
                            alt="Dụng cụ tập yoga"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s',
                            }}
                            className="hover-effect"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ marginBottom: 3 }} />

            {/* Các sản phẩm của cửa hàng */}
            <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3, borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Sản Phẩm Của Chúng Tôi
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Đồ tập Yoga Tốt là nơi cung cấp tất cả các sản phẩm liên quan đến Yoga và thiền:
                </Typography>
                <ul>
                    <li>Thảm tập Yoga</li>
                    <li>Trang phục luyện tập Yoga như: quần áo tập, găng tay, tất…</li>
                    <li>Các dụng cụ hỗ trợ luyện tập Yoga như: khăn trải thảm, bóng tập, vòng tập Yoga, võng tập Yoga, dây tập Yoga, gạch tập Yoga…</li>
                    <li>Thực phẩm nhằm nâng cao hiệu quả luyện tập như: thực phẩm chức năng, thức ăn kiêng, đồ uống…nguồn gốc từ thiên nhiên.</li>
                    <li>Ấn phẩm về Yoga như: sách, tạp chí, băng đĩa… (đang triển khai, chưa mở bán)</li>
                    <li>Vật phẩm Yoga như: quà tặng, đồ lưu niệm…</li>
                </ul>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <img
                            src="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/bong-tap-beyoga-cao-cap-2-in-1-chong-truot.jpg?v=1680851457157"
                            alt="Thảm tập yoga"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <img
                            src="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/ao-tap-bra3083-beyoga-san-pham.jpg?v=1684827471740"
                            alt="Găng tay yoga"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <img
                            src="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/tham-liforme-pho-thong-update16.jpg?v=1723610959270"
                            alt="Dụng cụ hỗ trợ yoga"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ marginBottom: 3 }} />

            {/* Cam kết và chính sách */}
            <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3, borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Cam Kết Của Chúng Tôi
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Cam kết hài lòng khách hàng 100%! Đó là tiêu chí hàng đầu của Đồ tập Yoga Tốt, thật vậy chúng tôi luôn tâm niệm và làm việc theo suy nghĩ: “Hãy phục vụ khách hàng như đang phục vụ cho chính bản thân mình”.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Chính vì vậy, những quan điểm kinh doanh dưới đây được Đồ tập Yoga Tốt hiểu rõ, thấm nhuần và quán triệt tuyệt đối:
                </Typography>
                <ul>
                    <li>Không bán hàng kém chất lượng, hàng giả, hàng nhái, hàng không rõ nguồn gốc…</li>
                    <li>Luôn cung cấp cho Quý khách hàng những sản phẩm tốt với giá cả cạnh tranh nhất, đi kèm những chế độ dịch vụ hoàn hảo nhất.</li>
                    <li>Luôn đặt chữ tín lên hàng đầu, không vì lợi nhuận mà gian dối với khách hàng…</li>
                    <li>Luôn làm hài lòng mọi khách hàng bằng việc thấu hiểu và thực hiện theo quan điểm: “Khách hàng luôn luôn đúng”.</li>
                </ul>
            </Paper>

            <Divider sx={{ marginBottom: 3 }} />
        </Box>
    );
};

export default About;
